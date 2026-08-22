import "server-only";
import { beds24Fetch, USE_MOCK_DATA } from "./client";
import { PROPERTY_CONFIG, PROPERTY_ID } from "./property-config";
import { getRangeAvailability } from "./availability";
import type { GuestCounts, OfferResult } from "./types";

function nightsBetween(checkIn: string, checkOut: string): number {
  const inDate = new Date(`${checkIn}T00:00:00Z`);
  const outDate = new Date(`${checkOut}T00:00:00Z`);
  return Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
}

type OffersResponse = {
  data: { roomId: number; propertyId: number; offers?: { price: number; unitsAvailable: number }[] }[];
};

/**
 * GET /inventory/rooms/offers returns the total room price for the exact
 * occupancy requested - Beds24 already applies its own configured
 * per-extra-guest surcharge, confirmed to match PROPERTY_CONFIG's rule
 * (+3000/night per guest past baseOccupancy). Returns null when the stay
 * isn't bookable for that occupancy (no offer / no units available).
 */
async function fetchOfferPrice(checkIn: string, checkOut: string, numAdults: number): Promise<number | null> {
  const response = await beds24Fetch<OffersResponse>("/inventory/rooms/offers", {
    query: { propertyId: PROPERTY_ID, arrival: checkIn, departure: checkOut, numAdults },
  });
  const offer = response.data[0]?.offers?.[0];
  if (!offer || offer.unitsAvailable < 1) return null;
  return offer.price;
}

/**
 * Returns a full price breakdown for the given stay, or an `available:
 * false` result explaining why not. The UI renders this as-is rather than
 * deriving its own totals, so displayed and charged amounts stay identical.
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
    const baseGuests = Math.min(totalGuests, PROPERTY_CONFIG.baseOccupancy);
    const roomFee = await fetchOfferPrice(checkIn, checkOut, baseGuests);
    if (roomFee === null) return { available: false, reason: "unavailable" };

    const occupancyTotal =
      totalGuests === baseGuests ? roomFee : await fetchOfferPrice(checkIn, checkOut, totalGuests);
    if (occupancyTotal === null) return { available: false, reason: "unavailable" };

    const extraGuestFee = occupancyTotal - roomFee;
    const cleaningFee = PROPERTY_CONFIG.cleaningFee;
    const total = occupancyTotal + cleaningFee;

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
