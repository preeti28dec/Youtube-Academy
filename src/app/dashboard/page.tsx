import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCompletedLessonIds, getCourse, moduleDuration } from "@/lib/course";
import { getCurrentUser, isEnrolled } from "@/lib/auth";
import { CheckIcon, ChevronDownIcon, PlayIcon } from "@/components/icons";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata = { title: "Mera course · Sohail YouTube Academy" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await getCourse();
  if (!course) notFound();

  // Bina payment dashboard nahi khulta.
  if (!(await isEnrolled(user.id, course.id))) redirect("/checkout");

  const done = await getCompletedLessonIds(user.id);
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const doneCount = allLessons.filter((l) => done.has(l.id)).length;
  const pct = allLessons.length ? Math.round((doneCount / allLessons.length) * 100) : 0;
  const next = allLessons.find((l) => !done.has(l.id)) ?? allLessons[0];

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-5.5 px-5 pt-9 pb-18">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted">Namaste, {user.name.split(" ")[0]}</span>
          <h1 className="text-[clamp(24px,3.4vw,30px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
            Mera course
          </h1>
        </div>
        <LogoutButton />
      </div>

      {/* ---------- progress card ---------- */}
      <div className="flex flex-wrap items-center gap-5.5 rounded-2xl border border-line bg-surface p-[clamp(18px,3vw,26px)] shadow-[0_1px_2px_rgba(20,24,33,.05)]">
        <span className="flex aspect-16/10 w-30 shrink-0 items-center justify-center rounded-[10px] bg-ink text-white">
          <PlayIcon size={22} />
        </span>
        <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3">
          <span className="text-[19px] font-extrabold leading-tight text-ink">{course.title}</span>
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-fill">
              <div className="h-full rounded-full bg-ok" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[13.5px] font-bold whitespace-nowrap text-ink">{pct}%</span>
          </div>
          <span className="text-[13px] font-medium text-muted">
            {doneCount} / {allLessons.length} lessons complete
          </span>
        </div>
        {next && (
          <Link
            href={`/learn/${next.id}`}
            className="flex flex-col gap-1.25 rounded-xl bg-brand px-5 py-3.75 text-[15px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            <span>Continue learning</span>
            <span className="text-[12.5px] font-medium text-[#d6d8fa]">{next.title}</span>
          </Link>
        )}
      </div>

      {/* ---------- modules ---------- */}
      <div className="flex flex-col gap-3">
        {course.modules.map((m, i) => {
          const moduleDone = m.lessons.filter((l) => done.has(l.id)).length;
          const complete = m.lessons.length > 0 && moduleDone === m.lessons.length;
          return (
            <details
              key={m.id}
              open={i === 0}
              className="group overflow-hidden rounded-[14px] border border-line bg-surface"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3.5 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span
                  className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold ${
                    complete ? "bg-ok-soft text-ok" : "bg-fill text-body"
                  }`}
                >
                  {m.position}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.25">
                  <span className="text-[15.5px] font-bold leading-snug text-ink">{m.title}</span>
                  <span className="text-[12.5px] font-medium text-muted">
                    {moduleDone} / {m.lessons.length} complete · {moduleDuration(m)}
                  </span>
                </span>
                <ChevronDownIcon
                  size={18}
                  className="shrink-0 text-muted transition-transform group-open:rotate-180"
                />
              </summary>

              <div className="border-t border-line">
                {m.lessons.map((l) => {
                  const isDone = done.has(l.id);
                  return (
                    <Link
                      key={l.id}
                      href={`/learn/${l.id}`}
                      className="flex min-h-13 items-center gap-3 border-b border-line-soft px-5 py-3.5 last:border-b-0 hover:bg-[#f7f8fa]"
                    >
                      <span
                        className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                          isDone ? "border-ok bg-ok text-white" : "border-line-strong bg-surface"
                        }`}
                      >
                        {isDone && <CheckIcon size={12} strokeWidth={3.4} />}
                      </span>
                      <span className="min-w-0 flex-1 text-[14.5px] font-medium leading-snug text-ink">
                        {l.title}
                      </span>
                      <span className="shrink-0 font-mono text-[12.5px] font-medium text-muted">
                        {l.duration}
                      </span>
                    </Link>
                  );
                })}
                {m.lessons.length === 0 && (
                  <p className="px-5 py-4 text-sm text-muted">Is module mein abhi koi lesson nahi.</p>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
