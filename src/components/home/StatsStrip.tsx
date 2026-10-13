import { STAT_LABELS } from "@/lib/site-content";

/** Hero ke neeche patti — numbers DB se aate hain, isliye hamesha sach rehte hain. */
export function StatsStrip({
  lessonCount,
  totalDuration,
}: {
  lessonCount: number;
  totalDuration: string;
}) {
  const stats = [
    { value: `${lessonCount}`, label: STAT_LABELS.lessons },
    { value: totalDuration, label: STAT_LABELS.duration },
    { value: "Lifetime", label: STAT_LABELS.access },
    { value: "Direct", label: STAT_LABELS.support },
  ];

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-2 gap-px bg-line md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1.5 bg-surface px-4 py-7 text-center"
          >
            <span className="text-[clamp(22px,3vw,28px)] font-extrabold tracking-[-0.02em] text-ink">
              {s.value}
            </span>
            <span className="text-[13px] font-medium text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
