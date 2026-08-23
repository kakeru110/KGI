import type { Locale } from "./i18n/config";
import { locales } from "./i18n/config";
import { SITE_URL } from "./site";

/**
 * Canonical + hreflang alternates for one page across every locale. `path`
 * is locale-less (e.g. "" for the top page, "/access" for /[locale]/access)
 * - each Next.js page must set its own full `alternates` object, since a
 * child route's metadata replaces rather than merges with its parent's.
 */
export function buildAlternates(locale: Locale, path: string) {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      "x-default": `${SITE_URL}/${locales[0]}${path}`,
    },
  };
}
