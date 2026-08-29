/**
 * Canonical absolute site URL, used to resolve metadataBase, OpenGraph
 * images, and hreflang/sitemap URLs.
 *
 * The default is the real custom domain rather than the Vercel one, so a
 * deploy that forgets NEXT_PUBLIC_SITE_URL still points search engines at
 * the right host - the failure mode of the old vercel.app default was
 * silent and expensive (every canonical, hreflang and sitemap URL naming
 * a host we don't want indexed). NEXT_PUBLIC_SITE_URL still overrides it,
 * which is what a preview deployment wants.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kamakuragateinn.com";

/**
 * The property's X (Twitter) account. The handle sets
 * twitter:site/creator, which attributes a shared link's card to the
 * account instead of leaving it anonymous; the profile URL goes in the
 * property's structured-data `sameAs`, which is how a search engine knows
 * the account and the property are the same business.
 */
export const SITE_X_HANDLE = "@kamakuragateinn";
export const SITE_X_URL = "https://x.com/kamakuragateinn";
