import type { Metadata } from "next";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { NEARBY_PARKING, PROPERTY_MAP_EMBED_SRC, PROPERTY_MAP_LINK, mapSearchUrl } from "@/lib/parking";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.parking, alternates: buildAlternates(locale, "/parking") };
}

export default async function ParkingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold sm:text-3xl">{dict.parking.heading}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{dict.parking.intro}</p>

      <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border">
        <iframe
          src={PROPERTY_MAP_EMBED_SRC}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kamakura Gate Inn"
        />
      </div>
      <a
        href={PROPERTY_MAP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
      >
        {dict.parking.mapLinkLabel}
      </a>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {NEARBY_PARKING.map((lot) => (
          <li key={lot.name} className="rounded-2xl border border-border p-5">
            <p className="font-medium">{lot.name}</p>
            <p className="mt-1 text-sm text-muted">{lot.address}</p>
            <p className="mt-2 text-sm text-muted">
              {dict.parking.distanceSuffix} {lot.distanceMeters}m
            </p>
            <p className="mt-1 text-sm">
              {dict.parking.priceLabel}: {locale === "ja" ? lot.priceJa : lot.priceEn}
            </p>
            <a
              href={mapSearchUrl(lot)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              {dict.parking.mapLinkLabel}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-muted">{dict.parking.disclaimer}</p>
    </div>
  );
}
