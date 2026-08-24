import type { Metadata } from "next";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { getOffer } from "@/lib/beds24/offers";
import { formatCurrency } from "@/lib/i18n/format";
import { viewItemEvent } from "@/lib/analytics";
import AnalyticsEvent from "@/components/AnalyticsEvent";
import BookingWidget from "@/components/BookingWidget";
import PriceBreakdown from "@/components/PriceBreakdown";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  // Canonicalize away any checkin/checkout/guests query string - the page
  // content varies by search, but there's nothing here worth ranking
  // separately per date combination.
  return { ...dict.seo.booking, alternates: buildAlternates(locale, "/booking") };
}

export default async function BookingPage({
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

  const hasQuery = Boolean(checkIn && checkOut && adults > 0);
  const offer = hasQuery
    ? await getOffer({ checkIn: checkIn!, checkOut: checkOut!, guests: { adults, children } })
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 pb-28 sm:px-6 sm:py-14 md:pb-14">
      <h1 className="text-2xl font-semibold sm:text-3xl">{dict.searchForm.heading}</h1>

      <BookingWidget
        locale={locale}
        dict={dict}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialAdults={adults || 2}
        initialChildren={children}
      />

      {!hasQuery && <p className="text-sm text-muted">{dict.results.selectDates}</p>}

      {offer && <PriceBreakdown offer={offer} locale={locale} dict={dict} />}

      {/* Top of the booking funnel: a real, bookable price was shown. */}
      {offer?.available && <AnalyticsEvent event={viewItemEvent(offer)} />}

      {offer?.available && (
        <StickyMobileCTA
          secondary={dict.results.total}
          primary={formatCurrency(offer.total)}
          href={`/${locale}/booking/guest-info?checkin=${offer.checkIn}&checkout=${offer.checkOut}&adults=${offer.adults}&children=${offer.children}`}
          label={dict.stickyCta.bookNow}
        />
      )}
    </div>
  );
}
