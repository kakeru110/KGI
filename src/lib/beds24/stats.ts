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
