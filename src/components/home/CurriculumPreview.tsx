import Link from "next/link";
import type { ModuleRow } from "@/lib/course";
import { SyllabusAccordion } from "@/components/SyllabusAccordion";

/**
 * Landing par poora syllabus — Figma ke "26 lessons. One clear path." wala
 * section. Accordion wahi hai jo /course page par hai, isliye dono jagah
 * ek jaisa dikhta hai aur ek hi jagah maintain hota hai.
 */
export function CurriculumPreview({
  modules,
  moduleCount,
  lessonCount,
  totalDuration,
}: {
  modules: ModuleRow[];
  moduleCount: number;
  lessonCount: number;
  totalDuration: string;
}) {
  return (
    <section id="curriculum" className="scroll-mt-20 border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-start gap-x-12 gap-y-8 px-5 pt-16 pb-18">
        <div className="flex flex-[1_1_300px] flex-col gap-4 lg:sticky lg:top-24">
          <span className="self-start rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-brand">
            Poora curriculum
          </span>
          <h2 className="text-[clamp(26px,4vw,38px)] font-extrabold leading-[1.12] tracking-[-0.025em] text-ink">
            {lessonCount} lessons.
            <br />
            Ek saaf raasta.
          </h2>
          <p className="max-w-[420px] text-[15.5px] leading-relaxed text-body">
            Har module pichhle par bana hai — aap thoda-thoda karke aage badhte hain, bina
            uljhan ke.
          </p>
          <dl className="flex gap-7 pt-1">
            <div className="flex flex-col gap-1">
              <dd className="text-[26px] font-extrabold text-ink">{moduleCount}</dd>
              <dt className="text-[12.5px] font-medium text-muted">Modules</dt>
            </div>
            <div className="flex flex-col gap-1">
              <dd className="text-[26px] font-extrabold text-ink">{totalDuration}</dd>
              <dt className="text-[12.5px] font-medium text-muted">Total duration</dt>
            </div>
          </dl>
          <Link
            href="/course"
            className="self-start rounded-xl border border-line-strong bg-surface px-5 py-3.25 text-[14.5px] font-semibold text-ink transition-colors hover:bg-[#f7f8fa]"
          >
            Poori details dekhein →
          </Link>
        </div>

        <div className="min-w-0 flex-[999_1_540px]">
          <SyllabusAccordion modules={modules} />
        </div>
      </div>
    </section>
  );
}
