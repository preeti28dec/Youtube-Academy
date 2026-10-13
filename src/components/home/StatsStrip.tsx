import type { Dictionary } from "@/i18n";

/** Hero ke neeche patti — numbers DB se aate hain, isliye hamesha sach rehte hain. */
export function StatsStrip({
  lessonCount,
  totalDuration,
  labels,
}: {
  lessonCount: number;
  totalDuration: string;
  labels: Dictionary["home"]["stats"];
}) {
  const stats = [
    { value: `${lessonCount}`, label: labels.lessons },
    { value: totalDuration, label: labels.duration },
    { value: labels.lifetime, label: labels.access },
    { value: labels.direct, label: labels.support },
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
