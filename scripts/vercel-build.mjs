#!/usr/bin/env node
/**
 * Vercel ka build step.
 *
 * Pehle yeh sab ek lambi `&&` chain thi, jisme fail hone par sirf
 * "exited with 1" dikhta tha — pata hi nahi chalta tha kaunsa step toota.
 * Ab har step ka naam aur asli wajah log mein aati hai.
 *
 * Teen aam dikkatein khud handle hoti hain:
 *   - DATABASE_URL quotes/space ke saath paste hua -> saaf kar dete hain
 *   - DATABASE_URL set hi nahi / postgres ka nahi  -> saaf message
 *   - DB pehle se bhara hua (P3005)                -> baseline karke aage
 */
import { spawnSync } from "node:child_process";

const BOLD = "\u001b[1m";
const RED = "\u001b[31m";
const YELLOW = "\u001b[33m";
const RESET = "\u001b[0m";

function run(label, cmd, args, opts = {}) {
  console.log(`\n${BOLD}[build] ${label}${RESET}`);
  const res = spawnSync(cmd, args, {
    stdio: opts.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (opts.capture) {
    const out = (res.stdout ?? "") + (res.stderr ?? "");
    if (out.trim()) console.log(out.trim());
    return { code: res.status ?? 1, out };
  }
  return { code: res.status ?? 1, out: "" };
}

function die(message) {
  console.error(`\n${RED}${BOLD}[build] ruk gaya${RESET}\n${message}\n`);
  process.exit(1);
}

/** Config adhoori hai — build chalti rahegi, site /setup page dikhayegi. */
function warnAndSkip(message) {
  console.log(`\n${YELLOW}${BOLD}[build] setup adhoora${RESET}\n${message}\n`);
}

/** DB jud gaya? Tabhi migrations chalte hain. */
let dbReady = false;

/** Password dikhaye bina batata hai ki value kaisi lag rahi hai. */
function describe(raw) {
  const v = (raw ?? "").trim();
  if (!v) return "(khaali)";
  const i = v.indexOf("://");
  const head = i > 0 ? v.slice(0, i + 3) : v.slice(0, 12);
  return `"${head}..."  (lambai ${v.length})`;
}

// ---------------------------------------------------------------- 1. provider
{
  const { code } = run("schema ko postgresql par set kar rahe hain", "node", [
    "scripts/switch-db.mjs",
    "postgresql",
  ]);
  if (code !== 0) die("scripts/switch-db.mjs fail hua — upar ka error dekhein.");
}

// ---------------------------------------------------------------- 2. generate
{
  const { code } = run("prisma generate", "npx", ["prisma", "generate"]);
  if (code !== 0) die("prisma generate fail hua — upar ka error dekhein.");
}

// ------------------------------------------------------- 3. DATABASE_URL saaf
// Dashboard mein value quotes ke saath paste karna sabse aam galti hai:
// .env file mein quotes chalti hain, lekin dashboard poori string literal
// maanta hai, to URL `"` se shuru ho jaata hai aur Prisma mana kar deta hai.
{
  const CANDIDATES = ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL"];
  let picked = null;

  for (const name of CANDIDATES) {
    const clean = (process.env[name] ?? "")
      .trim()
      .replace(/^["']+/, "")
      .replace(/["']+$/, "")
      .trim();
    if (clean) {
      picked = { name, clean, raw: process.env[name] };
      break;
    }
  }

  // Config ki kami par build FAIL nahi karte — site deploy ho jaati hai aur
  // /setup page khud bata deta hai ki kya daalna hai. Isse pehli baar deploy
  // karte waqt red cross ke bajaye ek kaam karti site milti hai.
  if (!picked) {
    warnAndSkip(
      `${YELLOW}DATABASE_URL set nahi hai — migrations skip kar rahe hain.${RESET}\n\n` +
        "Site deploy ho jayegi, lekin har page par setup wala message dikhega\n" +
        "jab tak database nahi jud jaata.\n\n" +
        "Karna kya hai:\n" +
        "  1. Vercel > Storage > Create Database > Neon (Postgres).\n" +
        "  2. Project se connect karein — DATABASE_URL apne aap add ho jaata hai.\n" +
        "  3. AUTH_SECRET, VIDEO_TOKEN_SECRET, NEXT_PUBLIC_WHATSAPP_NUMBER bhi daalein.\n" +
        "  4. Redeploy karein (env var add karne se purana build apne aap nahi banta).",
    );
  } else if (!/^postgres(ql)?:\/\//.test(picked.clean)) {
    warnAndSkip(
      `${YELLOW}${picked.name} postgres ka URL nahi lag raha — migrations skip.${RESET}\n\n` +
        `Abhi uski shuruaat hai: ${describe(picked.raw)}\n\n` +
        "Value postgresql:// se shuru honi chahiye.\n\n" +
        "Sabse aam galti — dashboard mein quotes ke saath paste karna:\n" +
        "  sahi : postgresql://user:pass@host:5432/db?sslmode=require\n" +
        '  galat: "postgresql://user:pass@host:5432/db?sslmode=require"\n\n' +
        "Doosri aam galti: file:./dev.db (SQLite) daal dena — woh Vercel par nahi chalta.",
    );
  } else {
    if (picked.clean !== picked.raw) {
      console.log(
        `\n[build] ${picked.name} ke aage/peeche quotes ya space the — saaf kar diya.`,
      );
    }
    // Aage ke steps isi saaf value ko dekhein.
    process.env.DATABASE_URL = picked.clean;
    dbReady = true;
    console.log(`[build] database: ${picked.name} se, ${describe(picked.clean)}`);
  }
}

// ---------------------------------------------------------------- 4. migrate
// DB jud gaya ho to migrations zaroori hain — yahan fail hona chahiye, warna
// site bin-tables ke deploy ho jayegi aur har page 500 dega.
if (dbReady) {
  // Neon/Supabase ka default URL connection POOLER (pgbouncer) se jaata hai.
  // App ke liye wahi sahi hai (serverless mein bahut saare short connections),
  // lekin migrations pooler par atak sakti hain — Prisma advisory lock leta hai
  // jo transaction-mode pooler support nahi karta. Isliye migration ke liye
  // seedha (unpooled) connection pasand karte hain, agar mil jaaye.
  const DIRECT = ["DIRECT_URL", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING"];
  const pooled = process.env.DATABASE_URL;

  for (const name of DIRECT) {
    const direct = (process.env[name] ?? "")
      .trim()
      .replace(/^["']+/, "")
      .replace(/["']+$/, "")
      .trim();
    if (direct && /^postgres(ql)?:\/\//.test(direct)) {
      process.env.DATABASE_URL = direct;
      console.log(`[build] migrations ke liye seedha connection: ${name}`);
      break;
    }
  }

  const { code, out } = run("prisma migrate deploy", "npx", ["prisma", "migrate", "deploy"], {
    capture: true,
  });

  // App ko wapas pooled URL milna chahiye.
  if (pooled) process.env.DATABASE_URL = pooled;

  if (code !== 0) {
    // P3005: DB mein tables pehle se hain lekin migration history nahi
    // (aam taur par tab, jab kabhi `prisma db push` chala diya gaya ho).
    // Aise mein initial migration ko "applied" mark karke aage badh jaate hain.
    if (out.includes("P3005")) {
      console.log(
        `\n${YELLOW}[build] DB mein tables pehle se hain (P3005) — ` +
          `0_init ko baseline maan kar aage badh rahe hain.${RESET}`,
      );
      const resolved = run("prisma migrate resolve --applied 0_init", "npx", [
        "prisma",
        "migrate",
        "resolve",
        "--applied",
        "0_init",
      ]);
      if (resolved.code !== 0) {
        die(
          "Baseline nahi ho paaya. Sabse aasaan raasta: us database ko khaali kar dein\n" +
            "(ya provider par naya database bana lein) aur dobara deploy karein —\n" +
            "initial migration poora schema khud bana degi.",
        );
      }
    } else if (/P1001|Can't reach database server|ECONNREFUSED|ETIMEDOUT/i.test(out)) {
      die(
        `${YELLOW}Database tak pahunch nahi paaye.${RESET}\n\n` +
          "DATABASE_URL set to hai, par connection nahi bana. Check karein:\n" +
          "  - host / port / password sahi hain\n" +
          "  - string ke aakhir mein ?sslmode=require laga hai (Neon/Supabase par zaroori)\n" +
          '  - DB provider par "allow connections from anywhere" on hai',
      );
    } else {
      die("prisma migrate deploy fail hua — upar ka asli error dekhein.");
    }
  }
}

// ---------------------------------------------------------------- 5. build
{
  const { code } = run("next build", "npx", ["next", "build"]);
  if (code !== 0) die("next build fail hua — upar ka error dekhein.");
}

console.log(`\n${BOLD}[build] ho gaya${RESET}\n`);
