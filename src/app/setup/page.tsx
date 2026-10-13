import Link from "next/link";
import { dbConfigProblem, describeDbUrl, resolveDbUrl } from "@/lib/db-url";
import { secretsConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { CheckIcon } from "@/components/icons";
import { BootstrapForm } from "./BootstrapForm";

export const metadata = { title: "Setup zaroori hai · Sohail YouTube Academy" };

// Env har request par padhni hai — build ke waqt ki value cache nahi karni.
export const dynamic = "force-dynamic";

const ENV_VARS = [
  {
    name: "DATABASE_URL",
    what: "Postgres ka connection string",
    how: "Vercel > Storage > Create Database > Neon. Connect karte hi yeh apne aap set ho jaata hai.",
  },
  {
    name: "AUTH_SECRET",
    what: "Login session sign karne ke liye",
    how: "Koi lamba random string.",
  },
  {
    name: "VIDEO_TOKEN_SECRET",
    what: "Video playback token sign karne ke liye",
    how: "Dusra lamba random string — AUTH_SECRET se alag.",
  },
  {
    name: "NEXT_PUBLIC_WHATSAPP_NUMBER",
    what: "WhatsApp support button ka number",
    how: "Country code ke saath, bina + — jaise 919812345678.",
  },
];

export default async function SetupPage() {
  const problem = dbConfigProblem();
  const resolved = resolveDbUrl();
  const secretsOk = secretsConfigured();

  // Env theek hai to aage ka sawaal yeh hai: database mein content hai ya nahi.
  let dbEmpty: boolean | null = null;
  if (!problem && secretsOk) {
    try {
      const [users, courses] = await Promise.all([prisma.user.count(), prisma.course.count()]);
      dbEmpty = users === 0 && courses === 0;
    } catch {
      dbEmpty = null; // connect hi nahi hua — neeche env wali list dikh jayegi
    }
  }

  // Sab taiyaar hai — yahan rukne ki zaroorat nahi.
  if (!problem && secretsOk && dbEmpty === false) {
    return (
      <div className="mx-auto w-full max-w-[560px] px-5 pt-14 pb-20">
        <div className="flex flex-col items-center gap-4 rounded-[18px] border border-line bg-surface p-[clamp(24px,5vw,40px)] text-center shadow-[0_4px_16px_rgba(20,24,33,.06)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ok-soft text-ok">
            <CheckIcon size={26} strokeWidth={2.6} />
          </span>
          <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-ink">
            Setup pura ho chuka hai
          </h1>
          <p className="text-[15px] leading-relaxed text-body">
            Database jud gaya hai aur course ka content maujood hai.
          </p>
          <Link
            href="/"
            className="w-full rounded-xl bg-brand px-5 py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark"
          >
            Site kholein
          </Link>
        </div>
      </div>
    );
  }

  // Env theek, par database khaali — shuruaati content banana hai.
  if (!problem && secretsOk && dbEmpty === true) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-5 pt-12 pb-20">
        <div className="flex flex-col gap-5 rounded-[18px] border border-line bg-surface p-[clamp(24px,5vw,40px)] shadow-[0_4px_16px_rgba(20,24,33,.06)]">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
              Aakhri step
            </span>
            <h1 className="text-[clamp(24px,4vw,30px)] font-extrabold leading-tight tracking-[-0.02em] text-ink">
              Database taiyaar hai — ab course ka content banayein
            </h1>
            <p className="text-[15px] leading-relaxed text-body">
              Neeche se shuruaati syllabus (6 modules, 20 lessons) aur aapka admin account bann
              jayega. Uske baad /admin se jo chahein badal sakte hain, aur videos jod sakte hain.
            </p>
          </div>
          <BootstrapForm />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pt-12 pb-20">
      <div className="flex flex-col gap-5 rounded-[18px] border border-line bg-surface p-[clamp(24px,5vw,40px)] shadow-[0_4px_16px_rgba(20,24,33,.06)]">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
            Setup
          </span>
          <h1 className="text-[clamp(24px,4vw,30px)] font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {problem
              ? "Site deploy ho gayi — ab database jodna baaki hai"
              : "Database jud gaya — bas do secrets baaki hain"}
          </h1>
          <p className="text-[15px] leading-relaxed text-body">
            Code bilkul theek hai. Bas hosting par kuch environment variables set karne hain,
            uske baad yeh page apne aap hat jayega aur asli site dikhne lagegi.
          </p>
        </div>

        {/* kya kami hai — asli diagnosis */}
        <div className="rounded-xl border border-danger-soft bg-danger-soft/60 px-4 py-3.5">
          <span className="text-[13.5px] font-semibold text-danger">
            {problem === "missing"
              ? "DATABASE_URL set nahi hai."
              : problem === "bad-protocol"
                ? `${resolved?.from ?? "DATABASE_URL"} postgres ka URL nahi lag raha — abhi uski shuruaat hai ${describeDbUrl(
                    resolved ? process.env[resolved.from] : undefined,
                  )}`
                : "Database jud gaya hai. Ab AUTH_SECRET aur VIDEO_TOKEN_SECRET baaki hain — inke bina session aur video token surakshit nahi rehte."}
          </span>
          {problem === "bad-protocol" && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-body">
              Value <code className="font-mono">postgresql://</code> se shuru honi chahiye.
              Sabse aam galti: dashboard mein value quotes ke saath paste kar dena — wahan quotes
              nahi lagani hoti.
            </p>
          )}
        </div>

        <ol className="flex flex-col gap-3">
          {[
            "Vercel dashboard > aapka project > Storage tab > Create Database > Neon (Postgres) chunein.",
            "Project se connect karein — DATABASE_URL apne aap add ho jaata hai.",
            secretsOk
              ? "Settings > Environment Variables mein baaki vars (jo neeche bina tick ke hain) daalein."
              : "Settings > Environment Variables mein AUTH_SECRET aur VIDEO_TOKEN_SECRET daalein (Production aur Preview dono).",
            "Deployments > latest > Redeploy. Env var add karne se purana build apne aap dobara nahi banta.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-bold text-brand">
                {i + 1}
              </span>
              <span className="text-[14.5px] leading-relaxed text-body">{step}</span>
            </li>
          ))}
        </ol>

        <div className="overflow-hidden rounded-[14px] border border-line">
          {ENV_VARS.map((v) => {
            const set = Boolean(process.env[v.name]);
            return (
              <div
                key={v.name}
                className="flex items-start gap-3 border-b border-line-soft px-4 py-3.5 last:border-b-0"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    set ? "bg-ok text-white" : "border-[1.5px] border-line-strong bg-surface"
                  }`}
                >
                  {set && <CheckIcon size={11} strokeWidth={3.4} />}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <code className="font-mono text-[13px] font-semibold text-ink">{v.name}</code>
                  <span className="text-[13.5px] leading-relaxed text-body">{v.what}</span>
                  <span className="text-[12.5px] leading-relaxed text-muted">{v.how}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-line bg-surface-muted px-4 py-3.5">
          <span className="text-[13px] font-semibold text-body">Random secret banane ke liye:</span>
          <pre className="mt-1.5 overflow-x-auto font-mono text-[12.5px] text-ink">
            node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;hex&apos;))&quot;
          </pre>
        </div>

        <p className="text-[13px] leading-relaxed text-muted">
          Poori guide repo ke <code className="font-mono">VERCEL.md</code> mein hai.
        </p>
      </div>
    </div>
  );
}
