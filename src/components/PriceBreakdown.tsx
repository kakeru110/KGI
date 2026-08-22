import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { OfferResult } from "@/lib/beds24/types";
import { formatCurrency, formatDateRange, formatGuestsCount, formatNights } from "@/lib/i18n/format";
import { buildExternalBookingUrl } from "@/lib/beds24/bookings";

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
        <p className="font-medium">{dict.results.unavailable}</p>
      </div>
    );
  }

  const lineItems = [
    { label: dict.results.roomFee, value: offer.roomFee },
    ...(offer.extraGuestFee > 0
      ? [{ label: dict.results.extraGuestFee, value: offer.extraGuestFee }]
      : []),
    { label: dict.results.cleaningFee, value: offer.cleaningFee },
  ];

  return (
    <div className="rounded-3xl border border-border bg-background p-6 shadow-sm shadow-black/5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
        <h3 className="text-lg font-semibold">{formatDateRange(offer.checkIn, offer.checkOut)}</h3>
        <p className="text-sm text-muted">
          {formatNights(offer.nights, locale)} · {formatGuestsCount(offer.guests, locale)}
        </p>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        {lineItems.map((item) => (
          <div key={item.label} className="flex justify-between">
            <dt className="text-muted">{item.label}</dt>
            <dd>{formatCurrency(item.value)}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
        <span>{dict.results.total}</span>
        <span>{formatCurrency(offer.total)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-muted">
        {dict.results.perNight} {formatCurrency(offer.perNight)}
      </p>

      <div className="mt-6 rounded-2xl bg-accent-soft p-5 text-center">
        <p className="text-sm text-muted">{dict.results.perPerson}</p>
        <p className="text-4xl font-bold text-accent sm:text-5xl">{formatCurrency(offer.perPerson)}</p>
        <p className="mt-2 text-xs text-muted">{dict.results.perPersonNote}</p>
      </div>

      <a
        href={buildExternalBookingUrl({
          checkIn: offer.checkIn,
          checkOut: offer.checkOut,
          guests: { adults: offer.adults, children: offer.children },
        })}
        className="mt-6 block rounded-full bg-accent px-4 py-3 text-center font-medium text-accent-foreground transition hover:opacity-90"
      >
        {dict.results.ctaBook}
      </a>

      <p className="mt-4 text-center text-xs text-muted">{dict.results.disclaimer}</p>
    </div>
  );
}
