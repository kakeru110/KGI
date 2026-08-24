import type { Locale } from "./i18n/config";
import type { Dictionary } from "./i18n/dictionary-type";
import { SITE_URL } from "./site";

/**
 * Stable @id for the property itself, so the full VacationRental markup on
 * the top page and the rating repeated on /reviews describe one entity
 * rather than two unrelated ones. Locale-scoped, because /ja and /en are
 * separate URLs describing the property in different languages.
 */
export function propertyEntityId(locale: Locale): string {
  return `${SITE_URL}/${locale}#property`;
}

/**
 * FAQPage markup for /faq, built from the same dictionary entries the page
 * renders - so the two can't drift. This is what makes the FAQ eligible to
 * be quoted directly in search results rather than only as a blue link.
 *
 * Google only shows FAQ rich results for a handful of site types now, but
 * the markup is also how the answers get read by anything else parsing the
 * page, and it costs nothing to keep accurate.
 */
export function buildFaqJsonLd(dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * The property's rating, attached to /reviews by the same @id the top page
 * uses. Only the aggregate: the individual reviews come from Beds24's
 * Airbnb/Booking.com channel endpoints, which carry no reviewer name, and
 * schema.org Review requires an `author` - inventing one to satisfy the
 * markup would be marking up something the page doesn't actually know.
 *
 * Returns null when there are no reviews yet (an aggregateRating with a
 * zero count is invalid markup, not an empty one).
 */
export function buildReviewsJsonLd(
  locale: Locale,
  dict: Dictionary,
  { totalCount, averageScore }: { totalCount: number; averageScore: number }
) {
  if (totalCount < 1 || averageScore <= 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": propertyEntityId(locale),
    name: dict.meta.siteName,
    url: `${SITE_URL}/${locale}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageScore,
      // Booking.com's 10-point scale, matching the score the page shows.
      bestRating: 10,
      reviewCount: totalCount,
    },
  };
}
