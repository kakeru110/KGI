import { locales } from "@/lib/i18n/config";
import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Image routes are Route Handlers, so they need their own param list -
// the layout's generateStaticParams doesn't reach them, and without this
// the card (fonts fetched, photo decoded, PNG rasterized) would be built
// on every crawler request instead of once at build time.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage(locale);
}
