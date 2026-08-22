import { Maximize, TrainFront, UsersRound, Wifi } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function StatCards({ dict }: { dict: Dictionary }) {
  const stats = [
    { ...dict.statCards.size, Icon: Maximize },
    { ...dict.statCards.guests, Icon: UsersRound },
    { ...dict.statCards.stationOfuna, Icon: TrainFront },
    { ...dict.statCards.stationKamakura, Icon: TrainFront },
    { ...dict.statCards.wifi, Icon: Wifi },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-surface px-4 py-5 text-center transition hover:border-accent/30 hover:bg-accent-soft/40"
        >
          <stat.Icon className="mx-auto h-5 w-5 text-accent" strokeWidth={1.5} />
          <p className="mt-2 text-xl font-semibold sm:text-2xl">{stat.value}</p>
          <p className="mt-1 text-xs text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
