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
};

type AirbnbReviewsResponse = {
  data: { public_review?: string; overall_rating?: number; submitted?: boolean }[];
};
type BookingReviewsResponse = {
  data: {
    content?: { positive?: string };
    scoring?: { review_score?: number };
  }[];
};

/**
 * Pulls guest reviews live from Airbnb/Booking.com via Beds24's channel
 * endpoints, so this is never stale hand-copied text (spec section 17:
 * only real review data, and it changes over time). Requires the
 * `read:channels` scope on BEDS24_REFRESH_TOKEN - until that's added,
 * these calls 401 and are swallowed below, so the site just shows no
 * reviews rather than erroring.
 */
export async function getReviews(locale: Locale, limit = 6): Promise<Review[]> {
  if (USE_MOCK_DATA) return [];

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

  const reviews: Review[] = [];

  if (airbnb.status === "fulfilled") {
    for (const r of airbnb.value.data) {
      if (r.submitted === false || !r.public_review || !r.overall_rating) continue;
      reviews.push({ rating: r.overall_rating, text: r.public_review, source: "Airbnb" });
    }
  }

  if (booking.status === "fulfilled") {
    for (const r of booking.value.data) {
      const text = r.content?.positive;
      const score = r.scoring?.review_score;
      if (!text || score === undefined) continue;
      // Booking.com scores out of 10; normalize to the 0-5 scale used elsewhere.
      reviews.push({ rating: score / 2, text, source: "Booking.com" });
    }
  }

  const limited = reviews.slice(0, limit);

  // Reviews arrive in whatever language the guest wrote them (Chinese,
  // English, Japanese, ...) - translate them all to the page's locale so
  // every visitor can read every review, regardless of source language.
  const translatedTexts = await translateTexts(
    limited.map((r) => r.text),
    locale
  );
  return limited.map((r, i) => ({ ...r, text: translatedTexts[i] }));
}
