import "server-only";
import { LEGACY_BOOKING_PAGE_URL, USE_MOCK_DATA } from "./client";
import { PROPERTY_ID } from "./property-config";
import type { GuestCounts } from "./types";

/**
 * Phase 1 handoff: builds a link into the existing hosted Beds24 booking
 * page, pre-filled with the dates/guests the user picked on our site.
 * Beds24 documents this pattern under "Make Your Own Booking Widget" -
 * confirm these exact query param names in the Beds24 dashboard before
 * launch, since they're not exposed via the public API docs.
 * https://wiki.beds24.com/index.php/Make_Your_Own_Booking_Widget
 */
export function buildExternalBookingUrl(params: {
  checkIn: string;
  checkOut: string;
  guests: GuestCounts;
}): string {
  const url = new URL(LEGACY_BOOKING_PAGE_URL);
  url.searchParams.set("propid", String(PROPERTY_ID));
  url.searchParams.set("checkin", params.checkIn);
  url.searchParams.set("checkout", params.checkOut);
  url.searchParams.set("numadult", String(params.guests.adults));
  if (params.guests.children > 0) {
    url.searchParams.set("numchild", String(params.guests.children));
  }
  return url.toString();
}

export type BookingSummary = {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "cancelled" | "request";
};

/**
 * Placeholder for a future admin dashboard (spec section 29). Not used by
 * the Phase 1 guest-facing site. Once credentials exist this should call
 * `GET /bookings` for PROPERTY_ID.
 */
export async function listBookings(): Promise<BookingSummary[]> {
  if (USE_MOCK_DATA) return [];
  throw new Error("Beds24 live bookings integration not implemented yet.");
}
