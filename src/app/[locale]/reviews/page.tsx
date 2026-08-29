import type { Metadata } from "next";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { buildReviewsJsonLd } from "@/lib/structured-data";
import { getReviews } from "@/lib/beds24/reviews";
import JsonLd from "@/components/JsonLd";
import ReviewsSection from "@/components/ReviewsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.reviews, alternates: buildAlternates(locale, "/reviews") };
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const { reviews, totalCount, averageScore } = await getReviews(locale, 100);
  const jsonLd = buildReviewsJsonLd(locale, dict, { totalCount, averageScore });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {jsonLd && <JsonLd data={jsonLd} />}
      <ReviewsSection
        locale={locale}
        dict={dict}
        reviews={reviews}
        totalCount={totalCount}
        averageScore={averageScore}
      />
    </div>
  );
}
