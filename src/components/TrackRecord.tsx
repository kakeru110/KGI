import * as Flags from "country-flag-icons/react/3x2";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { PropertyStats, RecentBookingPace } from "@/lib/beds24/stats";
import { formatGroupsCount, formatGuestsCount, formatRecentBookingPace } from "@/lib/i18n/format";

export default function TrackRecord({
  locale,
  dict,
  stats,
  recentPace,
}: {
  locale: Locale;
  dict: Dictionary;
  stats: PropertyStats;
  recentPace?: RecentBookingPace | null;
}) {
  const cards = [
    { label: dict.trackRecord.groupsLabel, value: formatGroupsCount(stats.totalGroups, locale) },
    { label: dict.trackRecord.guestsLabel, value: formatGuestsCount(stats.totalGuests, locale) },
    { label: dict.trackRecord.avgGroupSizeLabel, value: formatGuestsCount(stats.avgGroupSize, locale) },
    { label: dict.trackRecord.childRateLabel, value: `${stats.childRatePercent}%` },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold sm:text-3xl">{dict.trackRecord.heading}</h2>
      {recentPace && recentPace.count > 0 && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent">
          {formatRecentBookingPace(recentPace.count, recentPace.days, locale)}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-surface px-4 py-5 text-center">
            <p className="text-xl font-semibold sm:text-2xl">{card.value}</p>
            <p className="mt-1 text-xs text-muted">{card.label}</p>
          </div>
        ))}
      </div>
      {stats.countries.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-muted">{dict.trackRecord.countriesHeading}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stats.countries.map((country) => {
              const Flag = Flags[country.code as keyof typeof Flags];
              return (
                <li
                  key={country.code}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm"
                >
                  {Flag && <Flag title={country.name} className="h-3.5 w-auto rounded-[2px]" />}
                  <span>{country.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
