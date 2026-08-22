"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

export default function LocaleSwitcher({ locale, labels }: { locale: Locale; labels: Record<Locale, string> }) {
  const pathname = usePathname() || "/";
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-border">/</span>}
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            className={
              l === locale
                ? "font-semibold text-foreground"
                : "text-muted hover:text-foreground"
            }
          >
            {labels[l]}
          </Link>
        </span>
      ))}
    </div>
  );
}
