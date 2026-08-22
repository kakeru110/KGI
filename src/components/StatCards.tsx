import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function StatCards({ dict }: { dict: Dictionary }) {
  const stats = [
    dict.statCards.size,
    dict.statCards.guests,
    dict.statCards.stationOfuna,
    dict.statCards.stationKamakura,
    dict.statCards.wifi,
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-surface px-4 py-5 text-center"
        >
          <p className="text-xl font-semibold sm:text-2xl">{stat.value}</p>
          <p className="mt-1 text-xs text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
