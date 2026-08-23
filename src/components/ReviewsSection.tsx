import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Review } from "@/lib/beds24/reviews";
import { formatReviewCount, getRatingLabelKey } from "@/lib/i18n/format";

export default function ReviewsSection({
  locale,
  dict,
  reviews,
  totalCount = reviews.length,
  averageScore,
  showViewAll = false,
}: {
  locale: Locale;
  dict: Dictionary;
  reviews: Review[];
  totalCount?: number;
  averageScore?: number;
  showViewAll?: boolean;
}) {
  const ratingLabelKey = averageScore !== undefined ? getRatingLabelKey(averageScore) : null;
  const ratingLabel = ratingLabelKey
    ? {
        wonderful: dict.reviews.ratingWonderful,
        veryGood: dict.reviews.ratingVeryGood,
        good: dict.reviews.ratingGood,
        pleasant: dict.reviews.ratingPleasant,
      }[ratingLabelKey]
    : null;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold sm:text-3xl">{dict.reviews.heading}</h2>
        {showViewAll && reviews.length > 0 && (
          <Link href={`/${locale}/reviews`} className="text-sm font-medium text-accent hover:underline">
            {dict.reviews.viewAll}
          </Link>
        )}
      </div>
      {averageScore !== undefined && averageScore > 0 && (
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-xl font-bold text-white">
            {averageScore.toFixed(1)}
          </div>
          <div>
            {ratingLabel && <p className="font-semibold">{ratingLabel}</p>}
            <p className="text-sm text-muted">{formatReviewCount(totalCount, locale)}</p>
          </div>
        </div>
      )}
      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{dict.reviews.note}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {reviews.map((review, i) => (
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
