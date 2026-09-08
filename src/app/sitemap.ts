import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog/posts";

// Every public, indexable page (locale-less paths) - keep in sync with the
// generateMetadata() calls in src/app/[locale]/**/page.tsx. Transactional
// booking steps (guest-info, confirm) are deliberately excluded, see
// their own noindex metadata and robots.ts.
const PATHS = [
  "",
  "/rooms",
  "/gallery",
  "/access",
  "/parking",
  "/sightseeing",
  "/faq",
  "/reviews",
  "/guestbook",
  "/blog",
  ...BLOG_POSTS.map((post) => `/blog/${post.slug}`),
  "/booking",
  "/policy",
  "/tokushoho",
  "/contact",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    }))
  );
}
