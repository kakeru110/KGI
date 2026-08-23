import Link from "next/link";
import { Star } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Review } from "@/lib/beds24/reviews";
import { formatReviewCount, getRatingLabelKey } from "@/lib/i18n/format";

/** Renders a 0-5 rating as 5 star icons (filled vs. outline), not just a number. */
function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-accent">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className="h-4 w-4" fill={i < filled ? "currentColor" : "none"} strokeWidth={1.5} />
        ))}
      </div>
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

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
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-white">
            <span className="text-xl font-bold leading-none">{averageScore.toFixed(1)}</span>
            <span className="mt-0.5 text-[0.6rem] leading-none text-white/70">/10</span>
          </div>
          <div>
            {ratingLabel && <p className="font-semibold">{ratingLabel}</p>}
            <p className="text-sm text-muted">
              {formatReviewCount(totalCount, locale)} · {dict.reviews.outOf10}
            </p>
          </div>
        </div>
      )}
      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{dict.reviews.note}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {reviews.map((review, i) => {
            const Flag = review.countryCode ? Flags[review.countryCode as keyof typeof Flags] : undefined;
            return (
              <div key={i} className="rounded-2xl border border-border p-5">
                <StarRating rating={review.rating} />
                <p className="mt-2 text-sm text-muted">&ldquo;{review.text}&rdquo;</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  {Flag && <Flag className="h-3 w-auto rounded-[1px]" />}
                  {review.source}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
