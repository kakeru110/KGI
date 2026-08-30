import "server-only";
import { beds24Fetch, LEGACY_BOOKING_PAGE_URL, USE_MOCK_DATA } from "./client";
import { PROPERTY_ID, ROOM_ID } from "./property-config";
import type { CreatedBooking, GuestCounts, GuestDetails } from "./types";

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

type BookingsGetResponse = { data: { id: number }[] };
type BookingsPostResponse = { success: boolean; new?: { id: number }; errors?: { message: string }[] }[];

/**
 * Guards against creating a duplicate booking if a guest reloads the
 * confirmation page after their Stripe payment already produced one
 * (Beds24 has no built-in idempotency key for booking creation).
 */
async function findExistingBooking(email: string, arrival: string): Promise<number | null> {
  const response = await beds24Fetch<BookingsGetResponse>("/bookings", {
    query: { propertyId: PROPERTY_ID, searchString: email, arrival },
  });
  return response.data[0]?.id ?? null;
}

/**
 * Creates a confirmed Beds24 booking after a successful Stripe payment.
 * `total` must be the exact amount charged - it's stored as-is on the
 * booking so Beds24's records match what the guest paid.
 */
export async function createBooking(params: {
  checkIn: string;
  checkOut: string;
  guests: GuestCounts;
  guest: GuestDetails;
  total: number;
  stripeSessionId: string;
}): Promise<CreatedBooking> {
  const existingId = await findExistingBooking(params.guest.email, params.checkIn);
  if (existingId !== null) {
    return {
      bookingId: existingId,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: params.guests.adults + params.guests.children,
      total: params.total,
      currency: "JPY",
    };
  }

  const response = await beds24Fetch<BookingsPostResponse>("/bookings", {
    method: "POST",
    body: [
      {
        roomId: ROOM_ID,
        status: "confirmed",
        arrival: params.checkIn,
        departure: params.checkOut,
        numAdult: params.guests.adults,
        numChild: params.guests.children,
        firstName: params.guest.firstName,
        lastName: params.guest.lastName,
        email: params.guest.email,
        phone: params.guest.phone,
        price: params.total,
        notes: `Booked via website. Stripe checkout session: ${params.stripeSessionId}`,
      },
    ],
  });

  const result = response[0];
  if (!result?.success || !result.new) {
    throw new Error(`Beds24 booking creation failed: ${JSON.stringify(result?.errors)}`);
  }

  return {
    bookingId: result.new.id,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    guests: params.guests.adults + params.guests.children,
    total: params.total,
    currency: "JPY",
  };
}

export type GuestRegistrationDetails = {
  address: string;
  occupation: string;
  hasJapanAddress: boolean;
  /** Required by 旅館業法/住宅宿泊事業法 only for guests with no Japanese address. */
  nationality?: string;
  passportNumber?: string;
};

type BookingNotesResponse = { data: { id: number; notes: string }[] };

/**
 * Records the guest-register details Japanese law requires (name/address/
 * occupation for every guest, plus nationality + passport number for guests
 * with no Japanese address) onto the existing Beds24 booking. Appended to
 * the `notes` field alongside the Stripe session note from createBooking,
 * rather than a separate database - the property owner manages everything
 * from the Beds24 dashboard they already use day to day.
 */
export async function recordGuestRegistration(
  bookingId: number,
  details: GuestRegistrationDetails
): Promise<void> {
  const existing = await beds24Fetch<BookingNotesResponse>("/bookings", {
    query: { id: bookingId },
  });

  const registerLines = [
    "[宿泊者名簿] 職業: " + details.occupation,
    details.hasJapanAddress
      ? null
      : `国籍: ${details.nationality || "(未入力)"} / 旅券番号: ${details.passportNumber || "(未入力)"}`,
  ].filter((line): line is string => line !== null);

  const notes = [existing.data[0]?.notes, ...registerLines].filter(Boolean).join("\n");

  const response = await beds24Fetch<BookingsPostResponse>("/bookings", {
    method: "POST",
    body: [{ id: bookingId, address: details.address, notes }],
  });

  const result = response[0];
  if (!result?.success) {
    throw new Error(`Beds24 guest registration update failed: ${JSON.stringify(result?.errors)}`);
  }
}
