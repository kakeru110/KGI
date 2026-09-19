import type { Metadata } from "next";
import Link from "next/link";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import GuestRegistrationForm from "@/components/GuestRegistrationForm";

// Reached from the booking-confirmation email's durable link, keyed to a
// bookingId query param rather than an ephemeral Stripe session_id - not a
// page worth ranking on its own.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function GuestRegisterPage({
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
  const bookingIdParam = typeof sp.bookingId === "string" ? sp.bookingId : undefined;
  const bookingId = bookingIdParam ? Number(bookingIdParam) : NaN;

  if (!bookingIdParam || !Number.isInteger(bookingId) || bookingId <= 0) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">{dict.guestRegistration.invalidLinkHeading}</h1>
        <p className="text-muted">{dict.guestRegistration.invalidLinkBody}</p>
        <Link href={`/${locale}`} className="inline-block text-accent hover:underline">
          {dict.confirm.backToTop}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <GuestRegistrationForm bookingId={bookingId} dict={dict} />
    </div>
  );
}
