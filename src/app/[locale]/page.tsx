import type { Metadata } from "next";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getMonthAvailability } from "@/lib/beds24/availability";
import { getReviews } from "@/lib/beds24/reviews";
import { getPropertyStats } from "@/lib/beds24/stats";
import { PROPERTY_CONFIG } from "@/lib/beds24/property-config";
import { PROPERTY_COORDS, PROPERTY_MAP_LINK } from "@/lib/parking";
import { formatFromPrice } from "@/lib/i18n/format";
import Hero from "@/components/Hero";
import PhotoMosaic from "@/components/PhotoMosaic";
import BookingWidget from "@/components/BookingWidget";
import StatCards from "@/components/StatCards";
import FacilityIntro from "@/components/FacilityIntro";
import AmenitiesList from "@/components/AmenitiesList";
import ReviewsSection from "@/components/ReviewsSection";
import TrackRecord from "@/components/TrackRecord";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  // Title/description are left unset here so they inherit the layout's
  // site-wide default (dict.meta.title/description) - only the canonical
  // and hreflang alternates need to be specific to this page's own path.
  return { alternates: buildAlternates(locale, "") };
}

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
  const toPrice = prices.length > 0 ? Math.max(...prices) : null;
  const { reviews, totalCount, averageScore } = await getReviews(locale, 6);
  const stats = await getPropertyStats(locale);

  // VacationRental structured data for rich results / local search - uses
  // the same GPS coordinates already shown publicly on /access and
  // /parking (the exact street address is deliberately withheld, see
  // src/lib/business-info.ts).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: dict.meta.siteName,
    description: dict.meta.description,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/photos/living-1.jpg`,
    // Links this entity to the verified Google Business Profile listing
    // (confirmed same place ID as the /parking page's map link).
    sameAs: [PROPERTY_MAP_LINK],
    address: {
      "@type": "PostalAddress",
      addressLocality: "横浜市栄区",
      addressRegion: "神奈川県",
      addressCountry: "JP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: PROPERTY_COORDS.lat,
      longitude: PROPERTY_COORDS.lng,
    },
    // 58sqm - matches statCards.size.value in the dictionaries.
    floorSize: { "@type": "QuantitativeValue", value: 58, unitCode: "MTK" },
    petsAllowed: false,
    numberOfBedrooms: 2,
    occupancy: { "@type": "QuantitativeValue", maxValue: PROPERTY_CONFIG.maxGuests },
    amenityFeature: dict.amenities.items.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.label,
      value: true,
    })),
    ...(fromPrice !== null && toPrice !== null
      ? { priceRange: `¥${fromPrice.toLocaleString("ja-JP")} - ¥${toPrice.toLocaleString("ja-JP")}` }
      : {}),
    ...(totalCount > 0 && averageScore > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageScore,
            bestRating: 10,
            reviewCount: totalCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero dict={dict} />

      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <PhotoMosaic locale={locale} dict={dict} />
      </div>

      <div id="booking" className="relative z-10 mx-auto mt-6 max-w-6xl px-4 sm:-mt-16 sm:px-6">
        <BookingWidget locale={locale} dict={dict} />
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20">
        <StatCards dict={dict} />
        <FacilityIntro dict={dict} />
        <AmenitiesList dict={dict} />
        {stats && <TrackRecord locale={locale} dict={dict} stats={stats} />}
        <ReviewsSection
          locale={locale}
          dict={dict}
          reviews={reviews}
          totalCount={totalCount}
          averageScore={averageScore}
          showViewAll
        />
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
