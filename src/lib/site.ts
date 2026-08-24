/**
 * Canonical absolute site URL, used to resolve metadataBase, OpenGraph
 * images, and hreflang/sitemap URLs. Override with NEXT_PUBLIC_SITE_URL
 * once a custom domain replaces the Vercel default.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://newfive.vercel.app";

/**
 * The property's X (Twitter) account, including the leading "@" - e.g.
 * "@kamakuragateinn". Sets twitter:site/creator, which is what attributes
 * a shared link's card to the account instead of leaving it anonymous.
 *
 * Empty means no account is configured, and the tags are left out
 * entirely rather than emitted blank.
 */
export const SITE_X_HANDLE = "";
