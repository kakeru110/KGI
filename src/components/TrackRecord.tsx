import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { PropertyStats } from "@/lib/beds24/stats";
import { formatGroupsCount, formatGuestsCount } from "@/lib/i18n/format";

export default function TrackRecord({
  locale,
  dict,
  stats,
}: {
  locale: Locale;
  dict: Dictionary;
  stats: PropertyStats;
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
          <p className="mt-2 text-sm leading-relaxed">{stats.countries.join(" / ")}</p>
        </div>
      )}
    </section>
  );
}
