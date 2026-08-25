/**
 * Canonical absolute site URL, used to resolve metadataBase, OpenGraph
 * images, and hreflang/sitemap URLs. Override with NEXT_PUBLIC_SITE_URL
 * once a custom domain replaces the Vercel default.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://newfive.vercel.app";

/**
 * The property's X (Twitter) account. The handle sets
 * twitter:site/creator, which attributes a shared link's card to the
 * account instead of leaving it anonymous; the profile URL goes in the
 * property's structured-data `sameAs`, which is how a search engine knows
 * the account and the property are the same business.
 */
export const SITE_X_HANDLE = "@kamakuragateinn";
export const SITE_X_URL = "https://x.com/kamakuragateinn";
