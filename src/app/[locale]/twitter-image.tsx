import { locales } from "@/lib/i18n/config";
import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

// Same card as opengraph-image: X reads twitter:image when it's present,
// and this keeps both tags pointing at a real generated image rather than
// leaving twitter:image to fall back on whatever else is in the metadata.
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

export default async function TwitterImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage(locale);
}
