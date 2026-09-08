import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * Excerpts from the physical guestbook (フリーノート) kept in the room -
 * summarized/paraphrased rather than quoted verbatim, and with nothing
 * identifying, since publishing a guest's own words (even anonymized)
 * needs their permission under copyright, not just privacy law.
 */
export default function GuestNotebook({ dict }: { dict: Dictionary }) {
  const { heading, intro, entries } = dict.guestNotebook;

  return (
    <section>
      <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>
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
