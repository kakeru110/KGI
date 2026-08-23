import type { Metadata } from "next";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.policy, alternates: buildAlternates(locale, "/policy") };
}

export default async function PolicyPage({
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
        <h1 className="text-2xl font-semibold sm:text-3xl">{dict.policy.heading}</h1>
        <p className="mt-2 text-sm text-muted">{dict.policy.intro}</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">{dict.policy.cancellationHeading}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {dict.policy.cancellationRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{dict.policy.paymentHeading}</h2>
        <p className="mt-2 text-sm text-muted">{dict.policy.paymentBody}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{dict.policy.contactHeading}</h2>
        <p className="mt-2 text-sm text-muted">{dict.policy.contactBody}</p>
      </section>
    </div>
  );
}
