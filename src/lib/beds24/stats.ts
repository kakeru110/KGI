import "server-only";
import { beds24Fetch, USE_MOCK_DATA } from "./client";
import { PROPERTY_ID } from "./property-config";
import type { Locale } from "../i18n/config";

export type CountryStat = { code: string; name: string };

export type PropertyStats = {
  totalGroups: number;
  totalGuests: number;
  avgGroupSize: number;
  childRatePercent: number;
  /** ISO code + localized name, guests-from-most-first, deduped. */
  countries: CountryStat[];
};

type BookingRecord = {
  status: string;
  numAdult?: number;
  numChild?: number;
  country2?: string | null;
};

type BookingsResponse = {
  data: BookingRecord[];
  pages?: { nextPageExists?: boolean };
};

/**
 * Pulls every non-cancelled past-or-upcoming booking (paginated) to build
 * real trust-signal stats for the homepage: total groups/guests hosted,
 * average group size, share of stays with children, and which countries
 * guests have come from. Deliberately aggregate-only - no names, dates,
 * or per-booking data ever leaves this function.
 *
 * `country2` is only trustworthy when the channel actually populates it
 * (confirmed against real data: Booking.com always sets a proper ISO
 * country there; Airbnb sometimes leaves it null and puts a *language*
 * code like "ja"/"zh" in the separate `country` field instead, which
 * would silently misreport language as country) - so bookings without a
 * real country2 are counted in the totals but skipped for the country list.
 */
export async function getPropertyStats(locale: Locale): Promise<PropertyStats | null> {
  if (USE_MOCK_DATA) return null;

  const today = new Date().toISOString().slice(0, 10);
  const bookings: BookingRecord[] = [];
  let page = 1;

  while (page <= 20) {
    const response = await beds24Fetch<BookingsResponse>("/bookings", {
      query: {
        propertyId: PROPERTY_ID,
        arrivalFrom: "2015-01-01",
        arrivalTo: today,
        status: ["confirmed", "new", "request"],
        page,
      },
      revalidateSeconds: 1800,
    });
    bookings.push(...response.data);
    if (!response.pages?.nextPageExists) break;
    page++;
  }

  if (bookings.length === 0) return null;

  let totalAdults = 0;
  let totalChildren = 0;
  let bookingsWithChildren = 0;
  const countryCounts = new Map<string, number>();

  for (const b of bookings) {
    totalAdults += b.numAdult ?? 0;
    totalChildren += b.numChild ?? 0;
    if ((b.numChild ?? 0) > 0) bookingsWithChildren++;

    const code = b.country2?.toUpperCase();
    if (code) countryCounts.set(code, (countryCounts.get(code) ?? 0) + 1);
  }

  const regionNames = new Intl.DisplayNames([locale === "ja" ? "ja" : "en"], { type: "region" });
  const countries = [...countryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([code]) => ({ code, name: regionNames.of(code) ?? code }));

  const totalGuests = totalAdults + totalChildren;

  return {
    totalGroups: bookings.length,
    totalGuests,
    avgGroupSize: Math.round((totalGuests / bookings.length) * 10) / 10,
    childRatePercent: Math.round((bookingsWithChildren / bookings.length) * 100),
    countries,
  };
}

export type RecentBookingPace = {
  count: number;
  days: number;
};

type PaceRecord = {
  bookingTime?: string | null;
};

type PaceResponse = {
  data: PaceRecord[];
  pages?: { nextPageExists?: boolean };
};

/**
 * Counts still-upcoming bookings that were made within the last `days`
 * days - a demand-momentum signal ("X new bookings in the last 30 days")
 * distinct from getPropertyStats' historical hosted-guest totals above.
 *
 * `bookingTime` is the Beds24 V2 booking-creation timestamp; like
 * country2 above, its reliability hasn't been confirmed against real
 * data yet (USE_MOCK_DATA is on in this repo) - confirm the field name
 * once real credentials exist. Bookings without it are simply excluded,
 * and if none have it at all this returns null so the UI can skip the
 * badge rather than show a misleadingly low count.
 */
export async function getRecentBookingPace(days = 30): Promise<RecentBookingPace | null> {
  if (USE_MOCK_DATA) return null;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const horizonStr = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const bookings: PaceRecord[] = [];
  let page = 1;

  while (page <= 20) {
    const response = await beds24Fetch<PaceResponse>("/bookings", {
      query: {
        propertyId: PROPERTY_ID,
        arrivalFrom: todayStr,
        arrivalTo: horizonStr,
        status: ["confirmed", "new", "request"],
        page,
      },
      revalidateSeconds: 1800,
    });
    bookings.push(...response.data);
    if (!response.pages?.nextPageExists) break;
    page++;
  }

  const withBookingTime = bookings.filter((b) => b.bookingTime);
  if (withBookingTime.length === 0) return null;

  const count = withBookingTime.filter((b) => new Date(b.bookingTime as string) >= cutoff).length;
  return { count, days };
}
