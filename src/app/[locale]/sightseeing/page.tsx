import type { Metadata } from "next";
import Image from "next/image";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates } from "@/lib/seo";
import { SIGHTSEEING_SPOTS, sightseeingMapUrl, type SightseeingArea } from "@/lib/sightseeing";

const AREAS: SightseeingArea[] = ["kamakura", "fujisawaEnoshima", "yokohama"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return { ...dict.seo.sightseeing, alternates: buildAlternates(locale, "/sightseeing") };
}

export default async function SightseeingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold sm:text-3xl">{dict.sightseeing.heading}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{dict.sightseeing.intro}</p>

      {AREAS.map((area) => {
        const spots = SIGHTSEEING_SPOTS.filter((s) => s.area === area);
        return (
          <div key={area} className="mt-10">
            <h2 className="text-xl font-semibold sm:text-2xl">{dict.sightseeing.areas[area]}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {spots.map((spot) => (
                <li key={spot.name} className="overflow-hidden rounded-2xl border border-border">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={spot.image}
                      alt={spot.name}
                      fill
                      sizes="(min-width: 640px) 400px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-medium">{spot.name}</p>
                    <p className="mt-2 text-sm text-muted">{locale === "ja" ? spot.descJa : spot.descEn}</p>
                    <p className="mt-3 text-sm">
                      {dict.sightseeing.accessLabel}: {locale === "ja" ? spot.accessJa : spot.accessEn}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <a
                        href={sightseeingMapUrl(spot)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        {dict.sightseeing.mapLinkLabel}
                      </a>
                      {spot.credit && (
                        <a
                          href={spot.credit.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted hover:underline"
                        >
                          {spot.credit.author} / {spot.credit.license}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
