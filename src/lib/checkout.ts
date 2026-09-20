import "server-only";
import type Stripe from "stripe";
import { createBooking } from "@/lib/beds24/bookings";
import type { CreatedBooking } from "@/lib/beds24/types";
import { sendBookingNotificationEmail, sendGuestConfirmationEmail } from "@/lib/email";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Shared by the confirm-page fallback and the Stripe webhook: verifies a
 * Checkout Session actually succeeded and, if so, creates the matching
 * Beds24 booking. createBooking() itself de-dupes by email + arrival, so
 * calling this twice for the same session (once from each caller) is safe -
 * the owner notification only fires on whichever call actually creates the
 * booking (booking.isNew), not on the de-duped second call.
 */
export async function completeBookingFromSession(
  session: Stripe.Checkout.Session
): Promise<CreatedBooking | null> {
  if (session.payment_status !== "paid") return null;

  const meta = session.metadata;
  if (!meta?.checkIn || !meta.checkOut || !meta.total || !meta.firstName || !meta.email) {
    return null;
  }

  const booking = await createBooking({
    checkIn: meta.checkIn,
    checkOut: meta.checkOut,
    guests: { adults: Number(meta.adults), children: Number(meta.children) },
    guest: {
      firstName: meta.firstName,
      lastName: meta.lastName,
      email: meta.email,
      phone: meta.phone,
    },
    total: Number(meta.total),
    stripeSessionId: session.id,
  });

  if (booking.isNew) {
    const guestName = `${meta.lastName} ${meta.firstName}`.trim();
    const locale = isLocale(meta.locale ?? "") ? (meta.locale as "ja" | "en") : defaultLocale;

    await sendBookingNotificationEmail({
      bookingId: booking.bookingId,
      guestName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      total: booking.total,
    });

    await sendGuestConfirmationEmail({
      to: meta.email,
      guestName,
      locale,
      bookingId: booking.bookingId,
    });
  }

  return booking;
}
