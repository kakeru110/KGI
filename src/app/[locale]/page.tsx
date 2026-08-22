import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getMonthAvailability } from "@/lib/beds24/availability";
import { getReviews } from "@/lib/beds24/reviews";
import { formatFromPrice } from "@/lib/i18n/format";
import Hero from "@/components/Hero";
import BookingWidget from "@/components/BookingWidget";
import StatCards from "@/components/StatCards";
import PhotoGrid from "@/components/PhotoGrid";
import FacilityIntro from "@/components/FacilityIntro";
import AmenitiesList from "@/components/AmenitiesList";
import ReviewsSection from "@/components/ReviewsSection";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default async function TopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const days = await getMonthAvailability(month);
  const prices = days.filter((d) => d.status === "available" && d.price !== null).map((d) => d.price as number);
  const fromPrice = prices.length > 0 ? Math.min(...prices) : null;
  const reviews = await getReviews();

  return (
    <>
      <Hero dict={dict} />

      <div id="booking" className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:-mt-16 sm:px-6">
        <BookingWidget locale={locale} dict={dict} />
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20">
        <StatCards dict={dict} />
        <PhotoGrid locale={locale} dict={dict} />
        <FacilityIntro dict={dict} />
        <AmenitiesList dict={dict} />
        <ReviewsSection dict={dict} reviews={reviews} />
      </div>

      {fromPrice !== null && (
        <StickyMobileCTA
          primary={formatFromPrice(fromPrice, locale)}
          href={`/${locale}/booking`}
          label={dict.stickyCta.checkAvailability}
        />
      )}
    </>
  );
}
