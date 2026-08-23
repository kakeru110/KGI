import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getReviews } from "@/lib/beds24/reviews";
import ReviewsSection from "@/components/ReviewsSection";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const { reviews, totalCount, averageScore } = await getReviews(locale, 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
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
