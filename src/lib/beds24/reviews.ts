import "server-only";
import { beds24Fetch, USE_MOCK_DATA } from "./client";
import { PROPERTY_ID, ROOM_ID } from "./property-config";
import { translateTexts } from "../translate";
import type { Locale } from "../i18n/config";

export type Review = {
  /** 0-5 scale, normalized from each platform's native scoring */
  rating: number;
  text: string;
  source: "Airbnb" | "Booking.com";
  /** ISO country code, only set when known with confidence - see getReviews. */
  countryCode?: string;
};

export type ReviewsResult = {
  reviews: Review[];
  totalCount: number;
  /** Average of all reviews (not just the returned/limited ones), 0-10 scale, Booking.com-style. */
  averageScore: number;
};

/** Review plus the channel booking reference used to look up a country for Airbnb reviews (which don't carry one themselves). Stripped before returning. */
type InternalReview = Review & { apiReference?: string };

type AirbnbReviewsResponse = {
  data: {
    public_review?: string;
    overall_rating?: number;
    submitted?: boolean;
    reservation_confirmation_code?: string;
  }[];
};
type BookingReviewsResponse = {
  data: {
    content?: { positive?: string };
    scoring?: { review_score?: number };
    reviewer?: { country_code?: string };
  }[];
};
type BookingsLookupResponse = {
  data: { apiReference: string; country2?: string | null }[];
};

/**
 * Pulls guest reviews live from Airbnb/Booking.com via Beds24's channel
 * endpoints, so this is never stale hand-copied text (spec section 17:
 * only real review data, and it changes over time). Requires the
 * `read:channels` scope on BEDS24_REFRESH_TOKEN - until that's added,
 * these calls 401 and are swallowed below, so the site just shows no
 * reviews rather than erroring.
 */
export async function getReviews(locale: Locale, limit = 6): Promise<ReviewsResult> {
  if (USE_MOCK_DATA) return { reviews: [], totalCount: 0, averageScore: 0 };

  // Reviews change slowly and aren't money-sensitive, so cache like the
  // availability calendar rather than forcing every page load to hit
  // Beds24 (and, unlike offers/bookings, this keeps the top page static).
  const [airbnb, booking] = await Promise.allSettled([
    beds24Fetch<AirbnbReviewsResponse>("/channels/airbnb/reviews", {
      query: { roomId: ROOM_ID },
      revalidateSeconds: 1800,
    }),
    // Booking.com's endpoint takes propertyId + a required "from" date
    // (unlike Airbnb's, which takes roomId and no date range) - "2015-01-01"
    // just needs to predate this property's earliest possible review.
    beds24Fetch<BookingReviewsResponse>("/channels/booking/reviews", {
      query: { propertyId: PROPERTY_ID, from: "2015-01-01" },
      revalidateSeconds: 1800,
    }),
  ]);

  const reviews: InternalReview[] = [];

  if (airbnb.status === "fulfilled") {
    for (const r of airbnb.value.data) {
      if (r.submitted === false || !r.public_review || !r.overall_rating) continue;
      // Airbnb's review payload has no guest-location field at all - the
      // confirmation code lets us look up the matching booking below,
      // which sometimes (not always) has one.
      reviews.push({
        rating: r.overall_rating,
        text: r.public_review,
        source: "Airbnb",
        apiReference: r.reservation_confirmation_code,
      });
    }
  }

  if (booking.status === "fulfilled") {
    for (const r of booking.value.data) {
      const text = r.content?.positive;
      const score = r.scoring?.review_score;
      if (!text || score === undefined) continue;
      // Booking.com scores out of 10; normalize to the 0-5 scale used elsewhere.
      // Unlike Airbnb, Booking.com's review payload already includes the
      // guest's country directly, no booking lookup needed.
      reviews.push({
        rating: score / 2,
        text,
        source: "Booking.com",
        countryCode: r.reviewer?.country_code?.toUpperCase(),
      });
    }
  }

  const totalCount = reviews.length;
  const averageScore =
    totalCount > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 2 * 10) / 10
      : 0;

  const limited = reviews.slice(0, limit);

  // Resolve countries for the displayed Airbnb reviews by looking up their
  // bookings' country2 - same field, and same "only when populated" rule,
  // used for the aggregate country list in stats.ts. Only ~1 in 5 Airbnb
  // bookings actually have it, so most Airbnb reviews still show no flag,
  // but showing one when we do know it is still worth doing.
  const lookupReferences = [
    ...new Set(limited.map((r) => r.apiReference).filter((ref): ref is string => !!ref)),
  ];
  if (lookupReferences.length > 0) {
    const bookingsLookup = await beds24Fetch<BookingsLookupResponse>("/bookings", {
      query: { propertyId: PROPERTY_ID, apiReference: lookupReferences },
      revalidateSeconds: 1800,
    }).catch(() => null);
    if (bookingsLookup) {
      const countryByReference = new Map(
        bookingsLookup.data.filter((b) => b.country2).map((b) => [b.apiReference, b.country2 as string])
      );
      for (const review of limited) {
        if (review.apiReference) review.countryCode ??= countryByReference.get(review.apiReference);
      }
    }
  }

  // Reviews arrive in whatever language the guest wrote them (Chinese,
  // English, Japanese, ...) - translate them all to the page's locale so
  // every visitor can read every review, regardless of source language.
  const translatedTexts = await translateTexts(
    limited.map((r) => r.text),
    locale
  );
  return {
    reviews: limited.map((r, i) => ({
      rating: r.rating,
      text: translatedTexts[i],
      source: r.source,
      countryCode: r.countryCode,
    })),
    totalCount,
    averageScore,
  };
}
