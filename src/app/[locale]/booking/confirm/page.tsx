import type { Metadata } from "next";
import Link from "next/link";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getStripeClient } from "@/lib/stripe/client";
import { completeBookingFromSession } from "@/lib/checkout";
import { formatCurrency, formatDateRange, formatGuestsCount, formatNights } from "@/lib/i18n/format";
import { purchaseEvent } from "@/lib/analytics";
import AnalyticsEvent from "@/components/AnalyticsEvent";
import GuestRegistrationForm from "@/components/GuestRegistrationForm";

// Post-payment confirmation, keyed to a one-time Stripe session id - not a
// page worth ranking on its own, and it could carry booking details.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BookingConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;

  const failure = (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-semibold">{dict.confirm.notPaidHeading}</h1>
      <p className="text-muted">{dict.confirm.notPaidBody}</p>
      <p className="text-sm text-muted">
        {dict.confirm.notPaidContactPrefix}
        <Link href={`/${locale}/contact`} className="text-accent underline">
          {dict.nav.contact}
        </Link>
        {dict.confirm.notPaidContactSuffix}
      </p>
      <Link href={`/${locale}`} className="inline-block text-accent hover:underline">
        {dict.confirm.backToTop}
      </Link>
    </div>
  );

  if (!sessionId) return failure;

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const booking = await completeBookingFromSession(session);
  if (!booking) return failure;

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-16 text-center sm:px-6">
      {/* Payment succeeded and the Beds24 booking exists - the one event
          that gives every other number on the site a value. */}
      <AnalyticsEvent event={purchaseEvent(booking)} />

      <h1 className="text-2xl font-semibold sm:text-3xl">{dict.confirm.successHeading}</h1>
      <p className="text-muted">{dict.confirm.successBody}</p>
      <p className="text-sm text-muted">{dict.confirm.checkinInfoNote}</p>

      <div className="rounded-2xl border border-border bg-surface p-6 text-left">
        <p className="text-sm text-muted">{dict.confirm.bookingIdLabel}</p>
        <p className="text-lg font-semibold">{booking.bookingId}</p>
        <div className="mt-4 border-t border-border pt-4">
          <p className="font-medium">{formatDateRange(booking.checkIn, booking.checkOut)}</p>
          <p className="text-sm text-muted">
            {formatNights(
              Math.round(
                (new Date(`${booking.checkOut}T00:00:00Z`).getTime() -
                  new Date(`${booking.checkIn}T00:00:00Z`).getTime()) /
                  86400000
              ),
              locale
            )}{" "}
            · {formatGuestsCount(booking.guests, locale)}
          </p>
          <p className="mt-2 font-semibold">{formatCurrency(booking.total)}</p>
        </div>
      </div>

      <GuestRegistrationForm bookingId={booking.bookingId} dict={dict} />

      <Link href={`/${locale}`} className="inline-block text-accent hover:underline">
        {dict.confirm.backToTop}
      </Link>
    </div>
  );
}
