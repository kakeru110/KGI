/**
 * Plain, non-secret property configuration. Deliberately has no
 * "server-only" guard so client components (e.g. BookingWidget) can read
 * capacity/pricing constants without pulling in the Beds24 API client.
 */

export const PROPERTY_ID = 309861;

export const PROPERTY_CONFIG = {
  maxGuests: 6,
  baseOccupancy: 3,
  extraGuestFeePerNight: 3000,
  cleaningFee: 7200,
  currency: "JPY" as const,
};
