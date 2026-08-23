import type { Metadata } from "next";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { BUSINESS_INFO } from "@/lib/business-info";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.privacy, alternates: buildAlternates(locale, "/privacy") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{dict.privacy.heading}</h1>
        <p className="mt-2 text-sm text-muted">{dict.privacy.intro}</p>
      </div>

      {dict.privacy.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <p className="mt-2 text-sm text-muted">{section.body}</p>
        </section>
      ))}

      <section>
        <h2 className="text-lg font-semibold">{dict.privacy.contactHeading}</h2>
        <p className="mt-2 text-sm text-muted">
          {BUSINESS_INFO.operatorName}
          <br />
          {BUSINESS_INFO.email}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{dict.privacy.revisionHeading}</h2>
        <p className="mt-2 text-sm text-muted">{dict.privacy.revisionBody}</p>
      </section>
    </div>
  );
}
