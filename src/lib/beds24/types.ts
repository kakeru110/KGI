export type DayStatus = "available" | "full" | "closed";

export type DayAvailability = {
  /** ISO date, e.g. 2026-08-29 */
  date: string;
  status: DayStatus;
  /** Base nightly price in JPY for up to the base occupancy, null when not available */
  price: number | null;
  /** Minimum consecutive nights required for a stay starting on this date */
  minStay: number;
};

export type GuestCounts = {
  adults: number;
  children: number;
};

export type OfferBreakdown = {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  adults: number;
  children: number;
  roomFee: number;
  extraGuestFee: number;
  cleaningFee: number;
  total: number;
  perNight: number;
  perPerson: number;
  currency: "JPY";
};

export type OfferResult =
  | ({ available: true } & OfferBreakdown)
  | { available: false; reason: "unavailable" | "invalid-dates" | "over-capacity" }
  | { available: false; reason: "min-stay"; minNights: number };

export type GuestDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CreatedBooking = {
  bookingId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  currency: "JPY";
};
