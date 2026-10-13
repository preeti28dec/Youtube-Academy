import Link from "next/link";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/course";
import { rupees } from "@/lib/format";
import { getDictionary, t } from "@/i18n";
import { SyllabusAccordion } from "@/components/SyllabusAccordion";
import { CheckIcon } from "@/components/icons";

export const metadata = { title: "Course Details · Sohail YouTube Academy" };

export default async function CoursePage() {
  const course = await getCourse();
  if (!course) redirect("/setup");

  const d = getDictionary();
  const c = d.course;
  const price = rupees(course.pricePaise);
  const includes = d.home.includes.map((i) => t(i, { count: course.lessonCount }));

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-start gap-7 px-5 pt-10 pb-18">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
            {c.eyebrow}
          </span>
          <h1 className="text-[clamp(28px,4vw,38px)] font-extrabold leading-[1.12] tracking-[-0.025em] text-ink">
            {course.title}
          </h1>
          <p className="text-base leading-[1.65] text-pretty text-body">{course.description}</p>
        </div>

        <div className="flex flex-col gap-3.5 rounded-[14px] border border-line bg-surface p-5.5">
          <span className="text-base font-bold text-ink">{c.learnHeading}</span>
          <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
            {c.learnPoints.map((p) => (
              <div key={p} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-body">
                <CheckIcon size={17} className="mt-0.5 shrink-0 text-brand" />
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[22px] font-extrabold tracking-[-0.015em] text-ink">
              {c.syllabus}
            </h2>
            <span className="text-[13.5px] font-medium text-muted">
              {t(c.syllabusMeta, {
                modules: course.moduleCount,
                lessons: course.lessonCount,
                duration: course.totalDuration,
              })}
            </span>
          </div>
          <SyllabusAccordion modules={course.modules} />
        </div>
      </div>

      <aside className="flex flex-[1_1_300px] flex-col gap-4 rounded-2xl border border-line bg-surface p-5.5 shadow-[0_4px_16px_rgba(20,24,33,.06)] lg:sticky lg:top-21">
        <div className="flex items-baseline gap-2">
          <span className="text-[34px] font-extrabold tracking-[-0.02em] text-ink">₹{price}</span>
          <span className="text-[13px] font-medium text-muted">{c.oneTime}</span>
        </div>
        <Link
          href="/checkout"
          className="rounded-xl bg-brand px-5 py-3.75 text-center text-[15.5px] font-bold text-white transition-colors hover:bg-brand-dark"
        >
          {c.enrollNow}
        </Link>
        <div className="flex flex-col gap-2.75 pt-1">
          {includes.map((i) => (
            <div key={i} className="flex items-center gap-2.25 text-sm font-medium text-body">
              <CheckIcon size={16} className="shrink-0 text-ok" />
              {i}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
