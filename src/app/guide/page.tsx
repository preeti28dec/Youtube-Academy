import { ShieldIcon } from "@/components/icons";

export const metadata = { title: "Project guide · Sohail YouTube Academy" };

const SECURITY_POINTS = [
  {
    t: "Secure video hosting",
    d: "Videos are not kept on YouTube or Google Drive, but on a paid secure host such as VdoCipher or Bunny Stream — where no public download link exists in the first place.",
  },
  {
    t: "A fresh link that expires",
    d: "When an enrolled student opens a lesson, the server checks that they paid, then issues a signed token valid for a couple of minutes, for that student only. Copying the link and sending it to someone else simply will not work.",
  },
  {
    t: "Encrypted streaming + DRM",
    d: "Video is streamed in small encrypted chunks (HLS/DRM). A download manager or “inspect element” will not give anyone the whole file.",
  },
  {
    t: "Domain lock",
    d: "The player only runs on your own domain. Embedding it anywhere else will not play the video.",
  },
  {
    t: "Per-student watermark",
    d: "Each student's email shows faintly over the video. If a recording ever leaks, it is clear who it came from.",
  },
  {
    t: "Login limit",
    d: "An account stays logged in on only one or two devices at a time, so a shared password cannot be used by a crowd.",
  },
];

const FEATURE_GUIDE = [
  {
    t: "Home / Landing page",
    d: "Course introduction, benefits, price and the Enroll Now button. The intro video is available as a free preview.",
  },
  {
    t: "Course details",
    d: "The full description, what you will learn, and every module and lesson with its duration. Free preview lessons are marked separately.",
  },
  {
    t: "Payment page",
    d: "Name, mobile and email, then payment by UPI, Card or Net Banking through Razorpay or Cashfree.",
  },
  {
    t: "Automatic account + access",
    d: "The moment payment is confirmed the account is created, the course unlocks, and the password is sent by email and WhatsApp.",
  },
  {
    t: "Student login",
    d: "Log in with email or mobile plus a password. “Forgot password” resets it over email or OTP.",
  },
  {
    t: "Student dashboard",
    d: "The purchased course, all modules and lessons, and a “Continue learning” button that jumps to the next unfinished lesson.",
  },
  {
    t: "Video course",
    d: "Every video plays inside the website in a secure player. Without login and payment no lesson opens, apart from the free previews.",
  },
  {
    t: "Progress tracking",
    d: "A “Mark as complete” on every lesson. The dashboard shows an overall percentage and how many lessons are done in each module.",
  },
  {
    t: "WhatsApp support",
    d: "A WhatsApp button sits at the bottom right of every page and opens a chat to your number with a message already written.",
  },
  {
    t: "Admin panel",
    d: "Add, edit and delete modules and lessons, attach videos, mark free previews, and see the student list — name, mobile, email, join date and progress.",
  },
  {
    t: "Mobile friendly",
    d: "Every page was designed for mobile first — large buttons, a single column, and full-width video on a phone.",
  },
  {
    t: "Simple design",
    d: "A light, clean look. No heavy animation or extra features, so the site stays fast and maintenance stays cheap.",
  },
];

const STACK = [
  {
    k: "Website + admin",
    v: "Next.js 15 (React) — frontend and Node.js backend in one app. Only these 12 features, no extra plugins.",
  },
  {
    k: "Database",
    v: "PostgreSQL with the Prisma ORM — students, orders, lessons and progress. Local development runs on SQLite with no server setup at all.",
  },
  {
    k: "Payment gateway",
    v: "Razorpay or Cashfree — UPI, Card, Net Banking, with a webhook confirming each payment.",
  },
  {
    k: "Video hosting",
    v: "VdoCipher (DRM + watermark, the most secure) or Bunny Stream (cheaper, token + domain lock).",
  },
  {
    k: "Email / SMS",
    v: "Transactional email for login details and password resets (Brevo or Amazon SES).",
  },
  {
    k: "Hosting",
    v: "A small cloud server or managed hosting with SSL (https). Keeping video on a separate host keeps this server light.",
  },
];

const FLOW = [
  "Student pays",
  "Gateway webhook verifies",
  "Account created",
  "Course unlocked",
  "Login link by email + WhatsApp",
];

export default function GuidePage() {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5.5 px-5 pt-10 pb-20">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
          Project guide
        </span>
        <h1 className="text-[clamp(26px,4vw,34px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink">
          How the whole website works
        </h1>
        <p className="text-[15.5px] leading-[1.65] text-body">
          What each feature does, which services are involved, and how the course videos stay
          secure.
        </p>
      </div>

      {/* ---------- video security ---------- */}
      <section className="flex flex-col gap-3.5 rounded-2xl bg-ink p-[clamp(20px,4vw,30px)] text-white">
        <h2 className="flex items-center gap-2.5 text-[19px] font-extrabold leading-snug">
          <ShieldIcon size={20} className="shrink-0 text-[#7b81f0]" />
          Can anyone watch the course from a direct video link?
        </h2>
        <p className="text-base leading-relaxed font-semibold">
          No. As long as the videos sit on secure video hosting (VdoCipher or Bunny Stream) and
          the steps below are followed, nobody who hasn&rsquo;t paid can copy a link and play the
          video.
        </p>

        <ol className="flex flex-col gap-3 pt-1">
          {SECURITY_POINTS.map((p, i) => (
            <li key={p.t} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#7b81f0]/20 text-xs font-bold text-[#a9adf6]">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[14.5px] font-bold leading-snug">{p.t}</span>
                <span className="text-sm leading-relaxed text-onDark">{p.d}</span>
              </div>
            </li>
          ))}
        </ol>

        <p className="rounded-[10px] bg-[#d3a23e]/15 px-3.75 py-3.25 text-[13.5px] leading-relaxed font-medium text-[#f1d79a]">
          Worth being honest about: no system anywhere can fully stop someone recording their own
          screen on a phone. What DRM does is black out the recording on many devices, and the
          watermark makes a leaked copy traceable back to the student — which together bring the
          risk down a great deal.
        </p>
      </section>

      {/* ---------- feature list ---------- */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-4 text-base font-bold text-ink">
          Every feature — and how it works
        </h2>
        {FEATURE_GUIDE.map((f, i) => (
          <div
            key={f.t}
            className="flex items-start gap-3.5 border-b border-line-soft px-5 py-3.75 last:border-b-0"
          >
            <span className="w-5.5 shrink-0 font-mono text-[12.5px] font-bold leading-relaxed text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[14.5px] font-bold leading-snug text-ink">{f.t}</span>
              <span className="text-sm leading-relaxed text-body">{f.d}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- stack ---------- */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-4 text-base font-bold text-ink">
          Recommended setup (low cost, low maintenance)
        </h2>
        {STACK.map((s) => (
          <div
            key={s.k}
            className="grid gap-x-4 gap-y-1 border-b border-line-soft px-5 py-3.5 last:border-b-0 sm:grid-cols-[180px_1fr]"
          >
            <span className="text-[13.5px] font-semibold leading-relaxed text-muted">{s.k}</span>
            <span className="text-sm leading-relaxed font-medium text-ink">{s.v}</span>
          </div>
        ))}
      </section>

      {/* ---------- payment flow ---------- */}
      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-base font-bold text-ink">What happens automatically after payment</h2>
        <div className="flex flex-wrap items-center gap-2">
          {FLOW.map((f) => (
            <span
              key={f}
              className="rounded-[9px] bg-brand-soft px-3 py-2.25 text-[13px] font-semibold leading-snug text-brand-dark"
            >
              {f}
            </span>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-body">
          The payment gateway&rsquo;s webhook confirms the payment to our server — the
          browser&rsquo;s &ldquo;success&rdquo; message is never trusted on its own. That is what
          stops a faked payment from unlocking the course.
        </p>
      </section>
    </div>
  );
}
