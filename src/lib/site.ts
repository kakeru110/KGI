/**
 * Canonical absolute site URL, used to resolve metadataBase, OpenGraph
 * images, and hreflang/sitemap URLs. Override with NEXT_PUBLIC_SITE_URL
 * once a custom domain replaces the Vercel default.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://newfive.vercel.app";
