import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function ReviewsSection({ dict }: { dict: Dictionary }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold sm:text-3xl">{dict.reviews.heading}</h2>
      {dict.reviews.items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{dict.reviews.note}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {dict.reviews.items.map((review, i) => (
            <div key={i} className="rounded-2xl border border-border p-5">
              <p className="font-medium">{"★".repeat(Math.round(review.rating))} {review.rating.toFixed(1)}</p>
              <p className="mt-2 text-sm text-muted">&ldquo;{review.text}&rdquo;</p>
              <p className="mt-2 text-xs text-muted">{review.source}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
