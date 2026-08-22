import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import StatCards from "@/components/StatCards";
import FacilityIntro from "@/components/FacilityIntro";
import AmenitiesList from "@/components/AmenitiesList";

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:space-y-20 sm:px-6 sm:py-14">
      <StatCards dict={dict} />
      <FacilityIntro dict={dict} />
      <AmenitiesList dict={dict} />

      <section>
        <h2 className="text-2xl font-semibold sm:text-3xl">{dict.rooms.bedsHeading}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {dict.rooms.beds.map((bed) => (
            <div key={bed.room} className="rounded-2xl border border-border p-5">
              <p className="font-medium">{bed.room}</p>
              <p className="mt-1 text-sm text-muted">{bed.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold sm:text-3xl">{dict.rooms.policiesHeading}</h2>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {dict.rooms.policies.map((policy) => (
            <div key={policy.label} className="rounded-2xl bg-surface p-4 text-center">
              <dt className="text-xs text-muted">{policy.label}</dt>
              <dd className="mt-1 font-medium">{policy.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
