import "server-only";
import { USE_MOCK_DATA } from "./client";
import { PROPERTY_CONFIG } from "./property-config";
import { getRangeAvailability } from "./availability";
import type { GuestCounts, OfferResult } from "./types";

function nightsBetween(checkIn: string, checkOut: string): number {
  const inDate = new Date(`${checkIn}T00:00:00Z`);
  const outDate = new Date(`${checkOut}T00:00:00Z`);
  return Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Returns a full price breakdown for the given stay, or an `available:
 * false` result explaining why not. The UI must render this as-is rather
 * than deriving its own totals - once BEDS24_API_KEY is set this should
 * call `GET /inventory/rooms/offers` for PROPERTY_ID and return its
 * breakdown untouched, keeping displayed and charged amounts identical.
 */
export async function getOffer(params: {
  checkIn: string;
  checkOut: string;
  guests: GuestCounts;
}): Promise<OfferResult> {
  const { checkIn, checkOut, guests } = params;
  const totalGuests = guests.adults + guests.children;
  const nights = nightsBetween(checkIn, checkOut);

  if (nights <= 0) return { available: false, reason: "invalid-dates" };
  if (totalGuests < 1 || totalGuests > PROPERTY_CONFIG.maxGuests) {
    return { available: false, reason: "over-capacity" };
  }

  if (!USE_MOCK_DATA) {
    // TODO: replace with a real Beds24 API V2 call once credentials exist.
    throw new Error("Beds24 live offers integration not implemented yet.");
  }

  const days = await getRangeAvailability(checkIn, checkOut);
  if (days.some((day) => day.status !== "available" || day.price === null)) {
    return { available: false, reason: "unavailable" };
  }

  const roomFee = days.reduce((sum, day) => sum + (day.price ?? 0), 0);
  const extraGuests = Math.max(0, totalGuests - PROPERTY_CONFIG.baseOccupancy);
  const extraGuestFee = extraGuests * PROPERTY_CONFIG.extraGuestFeePerNight * nights;
  const cleaningFee = PROPERTY_CONFIG.cleaningFee;
  const total = roomFee + extraGuestFee + cleaningFee;

  return {
    available: true,
    checkIn,
    checkOut,
    nights,
    guests: totalGuests,
    adults: guests.adults,
    children: guests.children,
    roomFee,
    extraGuestFee,
    cleaningFee,
    total,
    perNight: Math.round(total / nights),
    perPerson: Math.round(total / totalGuests),
    currency: PROPERTY_CONFIG.currency,
  };
}
