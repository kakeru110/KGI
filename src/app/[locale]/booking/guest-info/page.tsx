import { redirect } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getOffer } from "@/lib/beds24/offers";
import { formatCurrency, formatDateRange, formatGuestsCount, formatNights } from "@/lib/i18n/format";
import GuestInfoForm from "@/components/GuestInfoForm";

export default async function GuestInfoPage({
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
  const checkIn = typeof sp.checkin === "string" ? sp.checkin : undefined;
  const checkOut = typeof sp.checkout === "string" ? sp.checkout : undefined;
  const adults = Number(typeof sp.adults === "string" ? sp.adults : "0");
  const children = Number(typeof sp.children === "string" ? sp.children : "0");

  if (!checkIn || !checkOut || adults < 1) {
    redirect(`/${locale}/booking`);
  }

  const offer = await getOffer({ checkIn, checkOut, guests: { adults, children } });
  if (!offer.available) {
    redirect(`/${locale}/booking?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="font-medium">{formatDateRange(offer.checkIn, offer.checkOut)}</p>
        <p className="text-sm text-muted">
          {formatNights(offer.nights, locale)} · {formatGuestsCount(offer.guests, locale)}
        </p>
        <p className="mt-2 text-lg font-semibold">
          {dict.results.total} {formatCurrency(offer.total)}
        </p>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{dict.guestInfo.heading}</h1>
        <div className="mt-6">
          <GuestInfoForm
            locale={locale}
            dict={dict}
            checkIn={offer.checkIn}
            checkOut={offer.checkOut}
            adults={adults}
            childrenCount={children}
          />
        </div>
      </div>
    </div>
  );
}
