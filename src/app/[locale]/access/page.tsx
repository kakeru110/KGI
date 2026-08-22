import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function AccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold sm:text-3xl">{dict.access.heading}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{dict.access.lead}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted">
          Map
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="rounded-2xl border border-border p-5">
            <p className="text-2xl font-semibold">{dict.statCards.stationOfuna.value}</p>
            <p className="text-sm text-muted">{dict.access.fromStation}</p>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <p className="text-2xl font-semibold">{dict.statCards.stationKamakura.value}</p>
            <p className="text-sm text-muted">{dict.statCards.stationKamakura.label}</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted">{dict.access.note}</p>
    </div>
  );
}
