import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}/rooms`, label: dict.nav.rooms },
    { href: `/${locale}/gallery`, label: dict.nav.gallery },
    { href: `/${locale}/access`, label: dict.nav.access },
    { href: `/${locale}/faq`, label: dict.nav.faq },
    { href: `/${locale}/policy`, label: dict.nav.policy },
    { href: `/${locale}/tokushoho`, label: dict.nav.tokushoho },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-surface pb-24 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-base font-semibold">{dict.meta.siteName}</p>
          <p className="mt-1 text-sm text-muted">{dict.footer.address}</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-muted">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 text-xs text-muted sm:px-6">{dict.footer.poweredBy}</p>
    </footer>
  );
}
