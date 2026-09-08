import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * Excerpts from the physical guestbook (フリーノート) kept in the room -
 * summarized/paraphrased rather than quoted verbatim, and with nothing
 * identifying, since publishing a guest's own words (even anonymized)
 * needs their permission under copyright, not just privacy law.
 *
 * `dict.guestNotebook.entries` is kept newest-first, so `limit` (used on
 * the top page) always shows the latest entries; the /guestbook page omits
 * `limit` to show all of them.
 */
export default function GuestNotebook({
  locale,
  dict,
  limit,
  showViewAll = false,
}: {
  locale: Locale;
  dict: Dictionary;
  limit?: number;
  showViewAll?: boolean;
}) {
  const { heading, intro, viewAll, entries: allEntries } = dict.guestNotebook;
  const entries = limit !== undefined ? allEntries.slice(0, limit) : allEntries;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>
        {showViewAll && (
          <Link href={`/${locale}/guestbook`} className="text-sm font-medium text-accent hover:underline">
            {viewAll}
          </Link>
        )}
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted">{intro}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-border bg-surface py-6 pl-9 pr-5 shadow-sm shadow-black/5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 1.7rem, rgba(28,28,26,0.07) 1.7rem, rgba(28,28,26,0.07) calc(1.7rem + 1px))",
            }}
          >
            <div className="absolute inset-y-0 left-0 flex w-7 flex-col items-center justify-evenly border-r border-dashed border-border">
              {Array.from({ length: 7 }).map((_, j) => (
                <span key={j} className="h-2 w-2 rounded-full bg-background ring-1 ring-border" />
              ))}
            </div>
            <p className="text-xs font-medium text-muted">{entry.season}</p>
            <p className="font-handwriting mt-2 text-lg leading-relaxed text-foreground">{entry.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
