import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional booking steps have their own noindex meta tag too
      // (see their page.tsx files) - disallowed here as well so crawlers
      // never fetch them in the first place.
      disallow: ["/api/", "/*/booking/guest-info", "/*/booking/confirm"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
