import { moduleDuration, type ModuleRow } from "@/lib/course";
import { ChevronDownIcon, LockIcon, PlayIcon } from "./icons";

/**
 * Public syllabus list (Course Details page).
 * Native <details> use karta hai — koi client JS nahi, isliye page tez khulta hai
 * aur JS band hone par bhi syllabus padha ja sakta hai.
 */
export function SyllabusAccordion({
  modules,
  defaultOpenFirst = true,
}: {
  modules: ModuleRow[];
  defaultOpenFirst?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {modules.map((m, i) => (
        <details
          key={m.id}
          open={defaultOpenFirst && i === 0}
          className="group overflow-hidden rounded-[14px] border border-line bg-surface"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3.5 px-5 py-4.5 [&::-webkit-details-marker]:hidden">
            <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-fill text-[13px] font-bold text-body">
              {m.position}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1.25">
              <span className="text-[15.5px] font-bold leading-snug text-ink">{m.title}</span>
              <span className="text-[12.5px] font-medium text-muted">
                {m.lessons.length} lessons · {moduleDuration(m)}
              </span>
            </span>
            <ChevronDownIcon
              size={18}
              className="shrink-0 text-muted transition-transform group-open:rotate-180"
            />
          </summary>

          <div className="border-t border-line">
            {m.lessons.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-3 border-b border-line-soft px-5 py-3.25 last:border-b-0"
              >
                {l.isFree ? (
                  <PlayIcon size={16} className="shrink-0 text-brand" />
                ) : (
                  <LockIcon size={16} className="shrink-0 text-faint" />
                )}
                <span className="min-w-0 flex-1 text-[14.5px] font-medium leading-snug text-body">
                  {l.title}
                </span>
                {l.isFree && (
                  <span className="shrink-0 rounded-md bg-ok-soft px-2 py-1 text-[11px] font-semibold text-ok">
                    Free preview
                  </span>
                )}
                <span className="shrink-0 font-mono text-[12.5px] font-medium text-muted">
                  {l.duration}
                </span>
              </div>
            ))}
            {m.lessons.length === 0 && (
              <p className="px-5 py-4 text-[14px] text-muted">Is module mein abhi koi lesson nahi.</p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
