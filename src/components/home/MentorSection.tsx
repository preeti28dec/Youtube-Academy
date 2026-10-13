import { MENTOR } from "@/lib/site-content";
import { CheckIcon, PlayIcon } from "@/components/icons";

/**
 * Figma ke mentor section ka saaf roop.
 *
 * Photo ki jagah abhi ek placeholder frame hai — Sohail ki asli photo
 * aate hi yahan <Image> laga denge. Jhoothe aankde (jaise "7+ years")
 * jaan-boojh kar nahi daale.
 */
export function MentorSection() {
  return (
    <section id="mentor" className="scroll-mt-20 bg-page">
      <div className="mx-auto grid w-full max-w-[1120px] items-center gap-10 px-5 pt-16 pb-18 lg:grid-cols-2">
        {/* photo placeholder */}
        <div className="relative">
          <div className="absolute -top-3 -left-3 h-full w-full rounded-[18px] bg-brand-soft" />
          <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-[18px] bg-ink">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#1c1f26_0_14px,#191c22_14px_28px)]" />
            <div className="relative flex flex-col items-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand">
                <PlayIcon size={24} />
              </span>
              <span className="text-[13px] font-semibold text-onDark">Sohail ki photo yahan</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4.5">
          <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
            {MENTOR.eyebrow}
          </span>
          <h2 className="text-[clamp(24px,3.6vw,34px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink">
            {MENTOR.heading}
          </h2>
          <p className="text-[15.5px] leading-relaxed text-body">{MENTOR.intro}</p>

          <blockquote className="border-l-[3px] border-brand pl-4 text-[16px] leading-relaxed font-semibold text-ink">
            &ldquo;{MENTOR.quote}&rdquo;
          </blockquote>

          <ul className="flex flex-col gap-2.5 pt-1">
            {MENTOR.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-body">
                <CheckIcon size={17} className="mt-0.5 shrink-0 text-ok" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
