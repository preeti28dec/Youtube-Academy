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

  if (!picked) {
    die(
      `${YELLOW}DATABASE_URL set nahi hai.${RESET}\n\n` +
        "Yeh app Postgres ke bina chal nahi sakta (Vercel par SQLite kaam nahi karta —\n" +
        "serverless par persistent disk hota hi nahi).\n\n" +
        "Karna kya hai:\n" +
        "  1. Ek Postgres lein — Vercel ka Storage tab, ya Neon / Supabase (free tier kaafi hai).\n" +
        "  2. Vercel > Settings > Environment Variables mein DATABASE_URL daalein,\n" +
        "     Production aur Preview dono ke liye.\n" +
        "  3. Redeploy karein (env var add karne se purana build apne aap nahi banta).\n\n" +
        "Baaki zaroori vars: AUTH_SECRET, VIDEO_TOKEN_SECRET, NEXT_PUBLIC_WHATSAPP_NUMBER.\n" +
        "Poori list VERCEL.md mein hai.",
    );
  }

  if (picked.clean !== picked.raw) {
    console.log(
      `\n[build] ${picked.name} ke aage/peeche quotes ya space the — saaf kar diya.`,
    );
  }

  if (!/^postgres(ql)?:\/\//.test(picked.clean)) {
    die(
      `${YELLOW}${picked.name} postgres ka URL nahi lag raha.${RESET}\n\n` +
        `Abhi uski shuruaat hai: ${describe(picked.raw)}\n\n` +
        "Value postgresql:// se shuru honi chahiye.\n\n" +
        "Sabse aam galti — dashboard mein quotes ke saath paste karna:\n" +
        "  sahi : postgresql://user:pass@host:5432/db?sslmode=require\n" +
        '  galat: "postgresql://user:pass@host:5432/db?sslmode=require"\n\n' +
        "Doosri aam galti: file:./dev.db (SQLite) daal dena — woh Vercel par nahi chalta.",
    );
  }

  // Aage ke steps isi saaf value ko dekhein.
  process.env.DATABASE_URL = picked.clean;
  console.log(`[build] database: ${picked.name} se, ${describe(picked.clean)}`);
}

// ---------------------------------------------------------------- 4. migrate
{
  const { code, out } = run("prisma migrate deploy", "npx", ["prisma", "migrate", "deploy"], {
    capture: true,
  });

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
