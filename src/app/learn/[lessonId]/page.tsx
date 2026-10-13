import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCompletedLessonIds, getCourse } from "@/lib/course";
import { getCurrentUser, isEnrolled } from "@/lib/auth";
import { formatMobile } from "@/lib/format";
import { SecureVideoPlayer } from "@/components/SecureVideoPlayer";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";

export const metadata = { title: "Video lesson · Sohail YouTube Academy" };

export default async function LearnPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const course = await getCourse();
  if (!course) notFound();

  // Flat list — prev/next aur progress dono isi se nikalte hain.
  const flat = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, modTitle: m.title, modNum: m.position })),
  );
  const index = flat.findIndex((l) => l.id === lessonId);
  if (index === -1) notFound();
  const lesson = flat[index];

  const user = await getCurrentUser();
  const enrolled = user ? await isEnrolled(user.id, course.id) : false;

  // Paid lesson bina enrollment ke nahi khulta. Yahi check /api/video/token
  // mein dobara hota hai, isliye URL seedha hit karne par bhi video nahi milti.
  if (!lesson.isFree && !enrolled) {
    redirect(user ? "/checkout" : "/login");
  }

  const done = user ? await getCompletedLessonIds(user.id) : new Set<string>();
  const doneCount = flat.filter((l) => done.has(l.id)).length;
  const pct = flat.length ? Math.round((doneCount / flat.length) * 100) : 0;

  const prev = index > 0 ? flat[index - 1] : null;
  const nextLesson = index < flat.length - 1 ? flat[index + 1] : null;
  const watermark = user ? `${user.email} · +91 ${formatMobile(user.mobile)}` : "Free preview";

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-5 pt-5 pb-18">
      <Link
        href={enrolled ? "/dashboard" : "/course"}
        className="flex items-center gap-1.5 self-start py-2 text-sm font-semibold text-body hover:text-brand"
      >
        <ArrowLeftIcon size={16} />
        {enrolled ? "Dashboard" : "Course details"}
      </Link>

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-4">
          <SecureVideoPlayer lessonId={lesson.id} watermark={watermark} />

          <div className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-semibold text-muted">
              Module {lesson.modNum} · {lesson.modTitle}
            </span>
            <h1 className="text-[clamp(20px,3vw,26px)] font-extrabold leading-tight tracking-[-0.02em] text-ink">
              {lesson.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {enrolled ? (
              <MarkCompleteButton lessonId={lesson.id} initialDone={done.has(lesson.id)} />
            ) : (
              <Link
                href="/checkout"
                className="flex-[1_1_200px] rounded-xl bg-brand px-4.5 py-3.5 text-center text-[14.5px] font-bold text-white hover:bg-brand-dark"
              >
                Poora course unlock karein
              </Link>
            )}
            {prev && (
              <Link
                href={`/learn/${prev.id}`}
                className="rounded-xl border border-line-strong bg-surface px-4 py-3.5 text-sm font-semibold text-ink hover:bg-[#f7f8fa]"
              >
                ← Previous
              </Link>
            )}
            {nextLesson && (
              <Link
                href={`/learn/${nextLesson.id}`}
                className="rounded-xl border border-line-strong bg-surface px-4 py-3.5 text-sm font-semibold text-ink hover:bg-[#f7f8fa]"
              >
                Next →
              </Link>
            )}
          </div>
        </div>

        {/* ---------- sidebar: progress + lesson list ---------- */}
        <aside className="flex min-w-0 flex-[1_1_300px] flex-col overflow-hidden rounded-[14px] border border-line bg-surface">
          <div className="flex flex-col gap-2.5 border-b border-line px-4.5 py-4">
            <span className="text-[15px] font-bold text-ink">Course progress</span>
            <div className="flex items-center gap-2.5">
              <div className="h-1.75 flex-1 overflow-hidden rounded-full bg-fill">
                <div className="h-full bg-ok" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[12.5px] font-bold text-ink">{pct}%</span>
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {course.modules.map((m) => (
              <div key={m.id}>
                <div className="border-b border-line-soft bg-surface-muted px-4.5 pt-3 pb-2 text-[11px] font-semibold tracking-[0.06em] uppercase text-faint">
                  {m.position}. {m.title}
                </div>
                {m.lessons.map((l) => {
                  const isCur = l.id === lesson.id;
                  const isDone = done.has(l.id);
                  const locked = !l.isFree && !enrolled;
                  return (
                    <Link
                      key={l.id}
                      href={locked ? "/checkout" : `/learn/${l.id}`}
                      className={`flex min-h-12 items-center gap-2.5 border-b border-line-soft px-4.5 py-3 ${
                        isCur ? "bg-brand-soft" : "bg-surface hover:bg-[#f7f8fa]"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                          isDone ? "border-ok bg-ok text-white" : "border-line-strong bg-surface"
                        }`}
                      >
                        {isDone && <CheckIcon size={11} strokeWidth={3.4} />}
                      </span>
                      <span
                        className={`min-w-0 flex-1 text-[13.5px] font-medium leading-snug ${
                          isCur ? "text-brand-dark" : "text-ink"
                        }`}
                      >
                        {l.title}
                      </span>
                      <span className="shrink-0 font-mono text-[11.5px] font-medium text-muted">
                        {l.duration}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
