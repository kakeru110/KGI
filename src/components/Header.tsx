import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileNav from "./MobileNav";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}`, label: dict.nav.top },
    { href: `/${locale}/rooms`, label: dict.nav.rooms },
    { href: `/${locale}/gallery`, label: dict.nav.gallery },
    { href: `/${locale}/access`, label: dict.nav.access },
    { href: `/${locale}/parking`, label: dict.nav.parking },
    { href: `/${locale}/sightseeing`, label: dict.nav.sightseeing },
    { href: `/${locale}/faq`, label: dict.nav.faq },
    { href: `/${locale}/reviews`, label: dict.nav.reviews },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
          <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9" priority />
          {dict.meta.siteName}
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-muted whitespace-nowrap lg:flex lg:gap-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/booking`}
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 sm:block"
          >
            {dict.nav.checkAvailability}
          </Link>
          <LocaleSwitcher locale={locale} labels={dict.language} />
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
