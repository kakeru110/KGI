/**
 * GA4 ecommerce events for the booking funnel.
 *
 * The root layout loads GA4 (@next/third-parties' <GoogleAnalytics />),
 * but pageviews alone can't answer the question that actually matters
 * here - which channel produces bookings. These three events make
 * /booking -> guest-info -> paid visible in GA4 as a funnel, and are what
 * a campaign (a Twitter announcement with UTM parameters, say) gets
 * measured against.
 *
 * Builders only - they return plain payloads, so server components can
 * assemble an event next to the data it describes. <AnalyticsEvent> is
 * what actually sends one, from the browser.
 *
 * In GA4, mark `purchase` (and usually `begin_checkout`) as key events:
 * Admin > Events > "Mark as key event".
 */
import { PROPERTY_ID, ROOM_ID } from "./beds24/property-config";
import type { CreatedBooking, OfferBreakdown } from "./beds24/types";

export type GaEvent = {
  name: "view_item" | "begin_checkout" | "purchase";
  /** GA4 event parameters, passed straight to gtag. */
  params: Record<string, unknown>;
  /**
   * Identifies this exact event, so a re-mount (client-side navigation
   * back to the same page, or React's double-invoked effects in
   * development) can't send it twice - see <AnalyticsEvent>.
   */
  dedupeKey: string;
};

/** JPY is a zero-decimal currency: these values are whole yen, like Stripe's amounts. */
const CURRENCY = "JPY";

/**
 * The property's single bookable unit as a GA4 ecommerce item. The name is
 * a constant rather than dict.meta.siteName so /ja and /en report as one
 * item instead of splitting the numbers in two (it's the same string in
 * both dictionaries anyway).
 */
const ITEM = {
  item_id: `beds24-${PROPERTY_ID}-${ROOM_ID}`,
  item_name: "Kamakura Gate Inn",
  item_category: "accommodation",
  quantity: 1,
};

function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round(
    (new Date(`${checkOut}T00:00:00Z`).getTime() - new Date(`${checkIn}T00:00:00Z`).getTime()) / 86400000
  );
}

/**
 * Shared shape for all three events. `check_in`/`nights`/`guests` are
 * custom parameters - GA4 collects them either way, but they only show up
 * in reports once registered as custom dimensions (Admin > Custom
 * definitions).
 */
function stayParams(stay: {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
}) {
  return {
    currency: CURRENCY,
    value: stay.total,
    items: [{ ...ITEM, price: stay.total }],
    check_in: stay.checkIn,
    check_out: stay.checkOut,
    nights: stay.nights,
    guests: stay.guests,
  };
}

/** /booking showed a real, bookable price for a specific stay. */
export function viewItemEvent(offer: OfferBreakdown): GaEvent {
  return {
    name: "view_item",
    params: stayParams(offer),
    dedupeKey: `view_item:${offer.checkIn}:${offer.checkOut}:${offer.guests}:${offer.total}`,
  };
}

/** The guest reached the guest-info form, i.e. started checkout. */
export function beginCheckoutEvent(offer: OfferBreakdown): GaEvent {
  return {
    name: "begin_checkout",
    params: stayParams(offer),
    dedupeKey: `begin_checkout:${offer.checkIn}:${offer.checkOut}:${offer.guests}:${offer.total}`,
  };
}

/**
 * Payment succeeded and the Beds24 booking exists. `transaction_id` is the
 * Beds24 booking id, which also makes this idempotent on GA4's side: it
 * drops a repeated purchase with a transaction_id it has already seen, so
 * a guest reloading or re-opening the confirmation link can't inflate
 * revenue even past this module's own de-duplication.
 */
export function purchaseEvent(booking: CreatedBooking): GaEvent {
  return {
    name: "purchase",
    params: {
      transaction_id: String(booking.bookingId),
      ...stayParams({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: nightsBetween(booking.checkIn, booking.checkOut),
        guests: booking.guests,
        total: booking.total,
      }),
    },
    dedupeKey: `purchase:${booking.bookingId}`,
  };
}
