import Link from "next/link";
import { BedDouble, CalendarDays, Sparkles, UsersRound } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { OfferResult } from "@/lib/beds24/types";
import { formatCurrency, formatDateRangeLabel, formatGuestsCount, formatMinStayNotice, formatNights } from "@/lib/i18n/format";

export default function PriceBreakdown({
  offer,
  locale,
  dict,
}: {
  offer: OfferResult;
  locale: Locale;
  dict: Dictionary;
}) {
  if (!offer.available) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 text-center">
        <p className="font-medium">
          {offer.reason === "min-stay" ? formatMinStayNotice(offer.minNights, locale) : dict.results.unavailable}
        </p>
      </div>
    );
  }

  const lineItems = [
    { label: dict.results.roomFee, value: offer.roomFee, Icon: BedDouble },
    ...(offer.extraGuestFee > 0
      ? [{ label: dict.results.extraGuestFee, value: offer.extraGuestFee, Icon: UsersRound }]
      : []),
    { label: dict.results.cleaningFee, value: offer.cleaningFee, Icon: Sparkles },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm shadow-black/5">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-surface px-6 py-5">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
          <h3 className="text-lg font-semibold">{formatDateRangeLabel(offer.checkIn, offer.checkOut, locale)}</h3>
        </div>
        <p className="rounded-full bg-background px-3 py-1 text-sm text-muted">
          {formatNights(offer.nights, locale)} · {formatGuestsCount(offer.guests, locale)}
        </p>
      </div>

      <div className="p-6">
        <dl className="space-y-3 text-sm">
          {lineItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <dt className="flex items-center gap-2.5 text-muted">
                <item.Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </dt>
              <dd className="tabular-nums">{formatCurrency(item.value)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-baseline justify-between rounded-2xl bg-surface px-4 py-3">
          <span className="font-semibold">{dict.results.total}</span>
          <span className="text-right">
            <span className="text-xl font-bold tabular-nums">{formatCurrency(offer.total)}</span>
            <span className="ml-1.5 text-xs text-muted">
              ({dict.results.perNight} {formatCurrency(offer.perNight)})
            </span>
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-accent-soft to-accent-soft/40 p-5 text-center">
          <p className="text-sm text-muted">{dict.results.perPerson}</p>
          <p className="text-4xl font-bold tabular-nums text-accent sm:text-5xl">
            {formatCurrency(offer.perPerson)}
          </p>
          <p className="mt-2 text-xs text-muted">{dict.results.perPersonNote}</p>
        </div>

        <Link
          href={`/${locale}/booking/guest-info?checkin=${offer.checkIn}&checkout=${offer.checkOut}&adults=${offer.adults}&children=${offer.children}`}
          className="mt-6 block rounded-full bg-accent px-4 py-3.5 text-center font-medium text-accent-foreground shadow-sm shadow-accent/30 transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
        >
          {dict.results.ctaBook}
        </Link>

        <p className="mt-4 text-center text-xs text-muted">{dict.results.disclaimer}</p>
      </div>
    </div>
  );
}
