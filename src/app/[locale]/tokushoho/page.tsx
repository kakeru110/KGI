import type { Metadata } from "next";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { BUSINESS_INFO } from "@/lib/business-info";
import { PROPERTY_CONFIG } from "@/lib/beds24/property-config";
import { formatCurrency } from "@/lib/i18n/format";

const MISSING = "(未設定)";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.tokushoho, alternates: buildAlternates(locale, "/tokushoho") };
}

export default async function TokushohoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const rows: { label: string; value: string }[] = [
    { label: dict.tokushoho.labels.operatorName, value: BUSINESS_INFO.operatorName || MISSING },
    { label: dict.tokushoho.labels.representativeName, value: BUSINESS_INFO.representativeName || MISSING },
    // Address/phone are disclosed on request rather than shown directly -
    // see the comment in business-info.ts for why.
    { label: dict.tokushoho.labels.address, value: dict.tokushoho.disclosureOnRequest },
    {
      label: dict.tokushoho.labels.phone,
      value: BUSINESS_INFO.phone || dict.tokushoho.phoneNotAvailable,
    },
    { label: dict.tokushoho.labels.email, value: BUSINESS_INFO.email || MISSING },
    { label: dict.tokushoho.labels.price, value: dict.tokushoho.priceNote },
    {
      label: dict.tokushoho.labels.additionalFees,
      value:
        PROPERTY_CONFIG.cleaningFee > 0
          ? `${dict.results.cleaningFee}: ${formatCurrency(PROPERTY_CONFIG.cleaningFee)}`
          : dict.tokushoho.noAdditionalFees,
    },
    { label: dict.tokushoho.labels.paymentMethods, value: dict.tokushoho.paymentMethodsValue },
    { label: dict.tokushoho.labels.paymentTiming, value: dict.policy.paymentBody },
    {
      label: dict.tokushoho.labels.serviceTiming,
      value: `${dict.rooms.policies[0].label} ${dict.rooms.policies[0].value} / ${dict.rooms.policies[1].label} ${dict.rooms.policies[1].value}`,
    },
    {
      label: dict.tokushoho.labels.cancellationPolicy,
      value: dict.policy.cancellationRules.join(" / "),
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{dict.tokushoho.heading}</h1>
        <p className="mt-2 text-sm text-muted">{dict.tokushoho.intro}</p>
      </div>

      <dl className="divide-y divide-border rounded-2xl border border-border">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 p-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-muted">{row.label}</dt>
            <dd className="text-sm sm:col-span-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
