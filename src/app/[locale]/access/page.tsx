import type { Metadata } from "next";
import { Footprints, TrainFront } from "lucide-react";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { PROPERTY_MAP_EMBED_SRC } from "@/lib/parking";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.access, alternates: buildAlternates(locale, "/access") };
}

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
        <div className="aspect-video overflow-hidden rounded-2xl border border-border">
          <iframe
            src={PROPERTY_MAP_EMBED_SRC}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kamakura Gate Inn"
          />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-border p-5">
            <Footprints className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.5} />
            <div>
              <p className="text-2xl font-semibold">{dict.statCards.stationOfuna.value}</p>
              <p className="text-sm text-muted">{dict.statCards.stationOfuna.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border p-5">
            <TrainFront className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.5} />
            <div>
              <p className="text-2xl font-semibold">{dict.statCards.stationKamakura.value}</p>
              <p className="text-sm text-muted">{dict.statCards.stationKamakura.label}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted">{dict.access.note}</p>
    </div>
  );
}
