"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { DayAvailability } from "@/lib/beds24/types";
import {
  formatCurrency,
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

  function handleDayClick(day: DayAvailability) {
    if (day.status !== "available") return;
    if (!checkIn || (checkIn && checkOut) || day.date <= checkIn) {
      setCheckIn(day.date);
      setCheckOut("");
    } else {
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
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-1">
          <span className="text-muted">{dict.searchForm.checkOut}</span>
          <input
            type="date"
            required
            value={checkOut}
            min={checkIn || new Date().toISOString().slice(0, 10)}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          />
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

        <div className="mt-3 flex gap-4 text-xs text-muted">
          <span>{formatRemainingThisMonth(remainingThisMonth, locale)}</span>
          <span>{formatRemainingWeekend(remainingWeekend, locale)}</span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted">
          {dict.availability.weekdays.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>
        <div className={`grid grid-cols-7 gap-1 ${loading ? "opacity-40" : ""}`}>
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const isFull = day.status !== "available";
            const isSelected = day.date === checkIn || day.date === checkOut;
            const inRange = checkIn && checkOut && day.date > checkIn && day.date < checkOut;
            return (
              <button
                key={day.date}
                type="button"
                disabled={isFull}
                onClick={() => handleDayClick(day)}
                className={`flex flex-col items-center rounded-lg px-1 py-2 text-xs transition ${
                  isFull
                    ? "cursor-not-allowed text-border"
                    : isSelected
                      ? "bg-accent text-accent-foreground"
                      : inRange
                        ? "bg-accent-soft"
                        : "hover:bg-surface"
                }`}
              >
                <span>{Number(day.date.slice(-2))}</span>
                <span className="mt-0.5">
                  {isFull ? "×" : day.price ? formatCurrency(day.price) : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
