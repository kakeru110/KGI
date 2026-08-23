"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { DayAvailability } from "@/lib/beds24/types";
import {
  formatCurrency,
  formatMinStayHint,
  formatRemainingThisMonth,
  formatRemainingWeekend,
} from "@/lib/i18n/format";
import { PROPERTY_CONFIG } from "@/lib/beds24/property-config";

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function BookingWidget({
  locale,
  dict,
  initialCheckIn = "",
  initialCheckOut = "",
  initialAdults = 2,
  initialChildren = 0,
}: {
  locale: Locale;
  dict: Dictionary;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
}) {
  const router = useRouter();
  const [month, setMonth] = useState(initialCheckIn.slice(0, 7) || currentYearMonth());
  const [loaded, setLoaded] = useState<{ month: string; days: DayAvailability[] } | null>(null);
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?month=${month}`)
      .then((res) => res.json())
      .then((data: { days: DayAvailability[] }) => {
        if (!cancelled) setLoaded({ month, days: data.days });
      });
    return () => {
      cancelled = true;
    };
  }, [month]);

  const loading = loaded?.month !== month;
  const days = useMemo(() => (loaded?.month === month ? loaded.days : []), [loaded, month]);

  const isPastMonth = month <= currentYearMonth().slice(0, 7) && month < currentYearMonth();

  const { remainingThisMonth, remainingWeekend } = useMemo(() => {
    let total = 0;
    let weekend = 0;
    for (const day of days) {
      if (day.status !== "available") continue;
      total += 1;
      const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      if (weekday === 5 || weekday === 6) weekend += 1;
    }
    return { remainingThisMonth: total, remainingWeekend: weekend };
  }, [days]);

  const minAvailablePrice = useMemo(() => {
    const prices = days
      .filter((d) => d.status === "available" && d.price !== null)
      .map((d) => d.price as number);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [days]);

  // A day showing "available" only means a unit is free that night - it
  // doesn't mean a stay starting there satisfies the property's minimum-stay
  // rule. Track the checked-in day's minStay so we can stop guests from
  // picking a too-short checkout that Beds24 would reject at booking time.
  const checkInMinStay = days.find((d) => d.date === checkIn)?.minStay ?? 1;
  const minCheckoutDate = checkIn ? addDays(checkIn, checkInMinStay) : null;

  /**
   * Default checkout: the earliest date that satisfies checkIn's minStay.
   * Pre-filled even when that date turns out to be full - a checkout date
   * has to be chosen either way, so this just saves a click in the common
   * case and still leaves it editable when it's not what the guest wants.
   */
  function autoCheckout(checkInDate: string): string {
    const minStay = days.find((d) => d.date === checkInDate)?.minStay ?? 1;
    return addDays(checkInDate, minStay);
  }

  function handleDayClick(day: DayAvailability) {
    if (day.status !== "available") return;
    if (!checkIn || (checkIn && checkOut) || day.date <= checkIn) {
      setCheckIn(day.date);
      setCheckOut(autoCheckout(day.date));
    } else if (minCheckoutDate === null || day.date >= minCheckoutDate) {
      setCheckOut(day.date);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      checkin: checkIn,
      checkout: checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/${locale}/booking?${params.toString()}`);
  }

  const totalGuests = adults + children;
  const firstOfMonth = new Date(`${month}-01T00:00:00Z`);
  const leadingBlanks = (firstOfMonth.getUTCDay() + 6) % 7;

  return (
    <div className="rounded-3xl border border-border bg-background p-4 shadow-sm shadow-black/5 sm:p-6">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm sm:col-span-1">
          <span className="text-muted">{dict.searchForm.checkIn}</span>
          <input
            type="date"
            required
            value={checkIn}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => {
              setCheckIn(e.target.value);
              setCheckOut(autoCheckout(e.target.value));
            }}
            className="rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-1">
          <span className="text-muted">{dict.searchForm.checkOut}</span>
          <input
            type="date"
            required
            value={checkOut}
            min={minCheckoutDate || checkIn || new Date().toISOString().slice(0, 10)}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          />
          {checkIn && checkInMinStay > 1 && (
            <span className="text-xs text-muted">{formatMinStayHint(checkInMinStay, locale)}</span>
          )}
        </label>
        <div className="flex gap-3 sm:col-span-1">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-muted">{dict.searchForm.adults}</span>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="rounded-lg border border-border px-3 py-2"
            >
              {Array.from({ length: PROPERTY_CONFIG.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n} disabled={n + children > PROPERTY_CONFIG.maxGuests}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-muted">{dict.searchForm.children}</span>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="rounded-lg border border-border px-3 py-2"
            >
              {Array.from({ length: PROPERTY_CONFIG.maxGuests }, (_, i) => i).map((n) => (
                <option key={n} value={n} disabled={n + adults > PROPERTY_CONFIG.maxGuests}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-end sm:col-span-1">
          <button
            type="submit"
            disabled={!checkIn || !checkOut || totalGuests < 1}
            className="w-full rounded-full bg-accent px-4 py-2.5 font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {dict.searchForm.submit}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-border pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold">{dict.availability.heading}</h3>
            <p className="text-sm text-muted">{dict.availability.subheading}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setMonth((m) => shiftMonth(m, -1))}
              disabled={isPastMonth}
              aria-label={dict.availability.prevMonth}
              className="rounded-full border border-border px-3 py-1 disabled:opacity-30"
            >
              ‹
            </button>
            <span className="min-w-[6ch] text-center font-medium">{month}</span>
            <button
              type="button"
              onClick={() => setMonth((m) => shiftMonth(m, 1))}
              aria-label={dict.availability.nextMonth}
              className="rounded-full border border-border px-3 py-1"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">
            {formatRemainingThisMonth(remainingThisMonth, locale)}
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">
            {formatRemainingWeekend(remainingWeekend, locale)}
          </span>
          <span className="ml-auto flex items-center gap-3 text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-price-good" />
              {dict.availability.bestValue}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              {dict.availability.legendFull}
            </span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs">
          {dict.availability.weekdays.map((w, i) => (
            <div
              key={w}
              className={`border-b-2 py-1.5 font-semibold ${
                i >= 5 ? "border-accent/40 text-accent" : "border-border text-muted"
              }`}
            >
              {w}
            </div>
          ))}
        </div>
        <div className={`mt-1.5 grid grid-cols-7 gap-1.5 ${loading ? "opacity-40" : ""}`}>
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((day, i) => {
            const isFull = day.status !== "available";
            const hasRange = Boolean(checkIn && checkOut);
            const isSelected = day.date === checkIn || day.date === checkOut;
            const inRange = hasRange && day.date > checkIn && day.date < checkOut;
            const isRangeStart = hasRange && day.date === checkIn;
            const isRangeEnd = hasRange && day.date === checkOut;
            const isBandMember = inRange || isRangeStart || isRangeEnd;
            const isBestValue =
              !isFull && day.price !== null && minAvailablePrice !== null && day.price === minAvailablePrice;
            const isBelowMinStay =
              !isFull &&
              Boolean(checkIn) &&
              !checkOut &&
              minCheckoutDate !== null &&
              day.date > checkIn &&
              day.date < minCheckoutDate;
            const weekday = (leadingBlanks + i) % 7;
            const isWeekend = weekday >= 5;

            return (
              <button
                key={day.date}
                type="button"
                disabled={isFull || isBelowMinStay}
                onClick={() => handleDayClick(day)}
                className={`relative flex flex-col items-center gap-1 border-2 px-1 py-3 text-xs transition ${
                  isBandMember ? "rounded-none border-transparent" : "rounded-xl"
                } ${isRangeStart ? "rounded-l-xl" : ""} ${isRangeEnd ? "rounded-r-xl" : ""} ${
                  isFull
                    ? "cursor-not-allowed border-transparent bg-rose-50/70 text-rose-300 line-through decoration-rose-300"
                    : isBelowMinStay
                      ? "cursor-not-allowed border-transparent text-muted/50"
                      : isSelected
                        ? "border-transparent bg-accent font-semibold text-accent-foreground shadow-md shadow-accent/30"
                        : inRange
                          ? "border-transparent bg-accent-soft text-foreground"
                          : isBestValue
                            ? "border-price-good bg-price-good-soft hover:brightness-95"
                            : `border-transparent hover:border-border ${isWeekend ? "bg-surface" : ""}`
                }`}
              >
                {isBestValue && !isSelected && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-price-good px-1.5 py-0.5 text-[0.6rem] font-bold leading-none text-white">
                    {dict.availability.bestValue}
                  </span>
                )}
                <span
                  className={`text-sm ${isWeekend && !isSelected && !inRange && !isBestValue ? "text-foreground/80" : ""}`}
                >
                  {Number(day.date.slice(-2))}
                </span>
                <span
                  className={`text-[0.7rem] tabular-nums ${
                    isFull
                      ? ""
                      : isSelected
                        ? "font-semibold"
                        : isBestValue
                          ? "font-bold text-price-good"
                          : "font-medium text-muted"
                  }`}
                >
                  {isFull ? dict.availability.legendFull : day.price ? formatCurrency(day.price) : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
