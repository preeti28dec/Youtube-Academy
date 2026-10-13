import Link from "next/link";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/course";
import { rupees } from "@/lib/format";
import { CheckIcon, LockIcon, PlayIcon } from "@/components/icons";

const BENEFITS = [
  {
    t: "Bilkul shuruaat se",
    d: "Channel banane se lekar pehli video publish karne tak, har step aasaan bhasha mein.",
  },
  {
    t: "Sirf mobile se",
    d: "Mehenga camera ya laptop zaroori nahi. Shooting aur editing mobile par sikhaai gayi hai.",
  },
  {
    t: "Thumbnail aur SEO",
    d: "Aisa title, thumbnail aur description jo search aur suggested videos mein dikhe.",
  },
  {
    t: "Growth strategy",
    d: "Analytics padhna, upload schedule banana aur audience ke saath judna.",
  },
  {
    t: "Monetization",
    d: "YouTube Partner Program, sponsorship aur affiliate se kamaai ke tareeke.",
  },
  {
    t: "WhatsApp support",
    d: "Koi bhi sawaal ho to seedha WhatsApp par message karein.",
  },
];

export default async function HomePage() {
  const course = await getCourse();
  // Fresh database — abhi content bana hi nahi. 404 ke bajaye setup par bhejein.
  if (!course) redirect("/setup");

  const price = rupees(course.pricePaise);
  const includes = [
    `${course.lessonCount} HD video lessons`,
    "Lifetime access",
    "Mobile aur laptop dono par",
    "Apni speed se seekhein",
    "Direct WhatsApp support",
  ];

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid w-full max-w-[1120px] items-center gap-12 px-5 pt-14 pb-16 lg:grid-cols-2">
          <div className="flex flex-col gap-5.5">
            <span className="self-start rounded-full bg-brand-soft px-3 py-1.75 text-[12.5px] font-semibold text-brand">
              {course.subtitle}
            </span>
            <h1 className="text-[clamp(32px,5vw,50px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance text-ink">
              {course.title}
            </h1>
            <p className="max-w-[520px] text-[17px] leading-relaxed text-pretty text-body">
              Zero se apna YouTube channel shuru karein aur grow karein. Channel setup, content
              planning, mobile editing, thumbnail, SEO aur monetization — sab kuch step-by-step, ek
              hi course mein.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/checkout"
                className="rounded-xl bg-brand px-6.5 py-4 text-base font-bold text-white shadow-[0_1px_2px_rgba(33,38,82,.22)] transition-colors hover:bg-brand-dark"
              >
                Enroll Now · ₹{price}
              </Link>
              <Link
                href="/course"
                className="rounded-xl border border-line-strong bg-surface px-5.5 py-3.75 text-[15px] font-semibold text-ink transition-colors hover:bg-[#f7f8fa]"
              >
                Syllabus dekhein
              </Link>
            </div>
            <dl className="flex flex-wrap gap-x-5.5 gap-y-3 pt-1.5">
              {[
                [course.moduleCount, "Modules"],
                [course.lessonCount, "Video lessons"],
                [course.totalDuration, "Total content"],
              ].map(([v, k]) => (
                <div key={String(k)} className="flex flex-col gap-1.25">
                  <dd className="text-xl font-extrabold text-ink">{v}</dd>
                  <dt className="text-[12.5px] font-medium text-muted">{k}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* trailer placeholder — asli intro video yahan free preview lesson se aayegi */}
          <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-[18px] bg-ink shadow-[0_24px_64px_rgba(16,18,30,.18)]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#1c1f26_0_14px,#191c22_14px_28px)]" />
            <div className="relative flex flex-col items-center gap-3.5">
              <span className="flex h-18 w-18 items-center justify-center rounded-full bg-white text-brand">
                <PlayIcon size={26} />
              </span>
              <span className="text-[13px] font-semibold text-onDark">
                Course intro video (free preview)
              </span>
            </div>
            <span className="absolute bottom-3.5 left-4 font-mono text-[11px] font-medium text-muted">
              trailer · 2:30
            </span>
          </div>
        </div>
      </section>

      {/* ---------- benefits ---------- */}
      <section className="mx-auto w-full max-w-[1120px] px-5 pt-16 pb-6">
        <h2 className="mb-2 text-[clamp(24px,3.4vw,32px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
          Is course mein aapko kya milega
        </h2>
        <p className="mb-7 text-base leading-relaxed text-body">
          Simple, practical aur Hindi mein — jo seekhenge wahi apne channel par turant apply kar
          sakenge.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.t}
              className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-surface p-5.5 shadow-[0_1px_2px_rgba(20,24,33,.05)]"
            >
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-brand-soft text-brand">
                <CheckIcon size={17} />
              </span>
              <span className="text-base font-bold text-ink">{b.t}</span>
              <span className="text-[14.5px] leading-relaxed text-body">{b.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- price ---------- */}
      <section className="mx-auto w-full max-w-[1120px] px-5 pt-12 pb-18">
        <div className="grid items-center gap-8 rounded-[18px] border border-line bg-surface p-[clamp(24px,4vw,40px)] shadow-[0_4px_16px_rgba(20,24,33,.06)] lg:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
              Course fee
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[46px] font-extrabold tracking-[-0.03em] text-ink">
                ₹{price}
              </span>
              <span className="text-sm font-medium text-muted">one-time payment</span>
            </div>
            <p className="text-[15px] leading-relaxed text-body">
              Ek baar payment, lifetime access. Koi monthly fee nahi. Payment ke turant baad account
              ban jaata hai aur course khul jaata hai.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {includes.map((i) => (
              <div key={i} className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
                <CheckIcon size={18} className="shrink-0 text-ok" />
                {i}
              </div>
            ))}
            <Link
              href="/checkout"
              className="mt-2 rounded-xl bg-brand px-5.5 py-4 text-center text-base font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Buy Now
            </Link>
            <span className="flex items-center justify-center gap-2 text-[12.5px] font-medium text-muted">
              <LockIcon size={14} />
              Secure payment · UPI, Card, Net Banking
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
