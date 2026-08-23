import type { Locale } from "./config";

/**
 * Small pluralization/formatting helpers, kept out of the Dictionary object
 * so it stays plain data (no functions) - Dictionary is passed from Server
 * to Client Components as a prop, and functions can't cross that boundary.
 */

export function formatNights(n: number, locale: Locale): string {
  return locale === "ja" ? `${n}泊` : `${n} night${n === 1 ? "" : "s"}`;
}

export function formatGuestsCount(n: number, locale: Locale): string {
  return locale === "ja" ? `${n}名` : `${n} guest${n === 1 ? "" : "s"}`;
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  return `${checkIn} → ${checkOut}`;
}

export function formatRemainingThisMonth(nights: number, locale: Locale): string {
  return locale === "ja" ? `今月の空室 残り${nights}泊` : `${nights} night${nights === 1 ? "" : "s"} left this month`;
}

export function formatRemainingWeekend(nights: number, locale: Locale): string {
  return locale === "ja" ? `週末の空室 残り${nights}泊` : `${nights} weekend night${nights === 1 ? "" : "s"} left`;
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export function formatFromPrice(amount: number, locale: Locale): string {
  return locale === "ja" ? `${formatCurrency(amount)}〜` : `from ${formatCurrency(amount)}`;
}

export function formatGroupsCount(n: number, locale: Locale): string {
  return locale === "ja" ? `${n.toLocaleString("ja-JP")}組` : `${n.toLocaleString("en-US")}`;
}

export function formatDateLabel(date: string, locale: Locale): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatDateWithWeekday(date: string, locale: Locale): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  });
}

export function formatDateRangeLabel(checkIn: string, checkOut: string, locale: Locale): string {
  return `${formatDateWithWeekday(checkIn, locale)} → ${formatDateWithWeekday(checkOut, locale)}`;
}

export function formatReviewCount(n: number, locale: Locale): string {
  return locale === "ja"
    ? `クチコミ${n.toLocaleString("ja-JP")}件`
    : `${n.toLocaleString("en-US")} review${n === 1 ? "" : "s"}`;
}

/** Booking.com-style rating bucket, picked from the dictionary by the caller. */
export type RatingLabelKey = "wonderful" | "veryGood" | "good" | "pleasant" | null;

export function getRatingLabelKey(scoreOutOf10: number): RatingLabelKey {
  if (scoreOutOf10 >= 9) return "wonderful";
  if (scoreOutOf10 >= 8) return "veryGood";
  if (scoreOutOf10 >= 7) return "good";
  if (scoreOutOf10 >= 6) return "pleasant";
  return null;
}
