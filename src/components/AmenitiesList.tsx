import {
  AirVent,
  Droplets,
  KeyRound,
  type LucideIcon,
  Sofa,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Wifi,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

// Matches the fixed order of dict.amenities.items in both dictionaries:
// Wi-Fi, TV, washer/dryer, bathroom dryer, AC, washlet, kitchen, sofa, self check-in.
const ICONS: LucideIcon[] = [Wifi, Tv, WashingMachine, Droplets, AirVent, Droplets, UtensilsCrossed, Sofa, KeyRound];

export default function AmenitiesList({ dict }: { dict: Dictionary }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold sm:text-3xl">{dict.amenities.heading}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {dict.amenities.items.map((item, i) => {
          const Icon = ICONS[i] ?? Sofa;
          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-2xl border border-border p-4 transition hover:border-accent/30 hover:bg-accent-soft/40"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <p className="font-medium">{item.label}</p>
                {item.sub && <p className="text-sm text-muted">{item.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
