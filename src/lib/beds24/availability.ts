import "server-only";
import { beds24Fetch, USE_MOCK_DATA } from "./client";
import { PROPERTY_ID } from "./property-config";
import type { DayAvailability, DayStatus } from "./types";

const BASE_RATE_BY_WEEKDAY = [
  26000, // Sunday
  23000, // Monday
  22000, // Tuesday
  22000, // Wednesday
  23000, // Thursday
  28000, // Friday
  34000, // Saturday
];

/** Deterministic string hash so mock data is stable across requests/deploys. */
function hashDate(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function mockDayAvailability(date: string): DayAvailability {
  const day = new Date(`${date}T00:00:00Z`);
  const weekday = day.getUTCDay();
  const hash = hashDate(date);

  let status: DayStatus = "available";
  if (hash % 11 === 0) status = "closed";
  else if (hash % 7 === 0) status = "full";

  const jitter = (hash % 5) * 400 - 800;
  const price = status === "available" ? BASE_RATE_BY_WEEKDAY[weekday] + jitter : null;

  return { date, status, price };
}

function daysInMonth(yearMonth: string): string[] {
  const [year, month] = yearMonth.split("-").map(Number);
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const monthStr = String(month).padStart(2, "0");
    return `${year}-${monthStr}-${day}`;
  });
}

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

type CalendarResponse = {
  data: {
    calendar: { from: string; to: string; numAvail: number; price1: number }[];
  }[];
};

/**
 * Fetches per-day availability/price for [startDate, endDate] (inclusive).
 * Beds24 collapses consecutive identical days into one {from, to} range,
 * so we expand each range back into individual DayAvailability entries.
 * price1 is the base rate for up to PROPERTY_CONFIG.baseOccupancy guests.
 */
async function fetchCalendarRange(startDate: string, endDate: string): Promise<DayAvailability[]> {
  const response = await beds24Fetch<CalendarResponse>("/inventory/rooms/calendar", {
    query: { propertyId: PROPERTY_ID, startDate, endDate, includePrices: true, includeNumAvail: true },
  });

  const days: DayAvailability[] = [];
  for (const range of response.data[0]?.calendar ?? []) {
    for (let date = range.from; date <= range.to; date = addDays(date, 1)) {
      days.push({
        date,
        status: range.numAvail > 0 ? "available" : "full",
        price: range.numAvail > 0 ? range.price1 : null,
      });
    }
  }
  return days;
}

/**
 * Returns availability + indicative base price for every day in the given
 * month (format YYYY-MM). Backed by deterministic mock data until
 * BEDS24_REFRESH_TOKEN is configured, then calls the real Beds24 calendar.
 */
export async function getMonthAvailability(yearMonth: string): Promise<DayAvailability[]> {
  if (USE_MOCK_DATA) {
    return daysInMonth(yearMonth).map(mockDayAvailability);
  }

  const days = daysInMonth(yearMonth);
  return fetchCalendarRange(days[0], days[days.length - 1]);
}

export async function getDayAvailability(date: string): Promise<DayAvailability> {
  if (USE_MOCK_DATA) {
    return mockDayAvailability(date);
  }
  const [day] = await fetchCalendarRange(date, date);
  if (!day) throw new Error(`No availability data for ${date}`);
  return day;
}

export async function getRangeAvailability(
  checkIn: string,
  checkOut: string
): Promise<DayAvailability[]> {
  const lastNight = addDays(checkOut, -1);
  if (USE_MOCK_DATA) {
    const nights: string[] = [];
    for (let date = checkIn; date <= lastNight; date = addDays(date, 1)) nights.push(date);
    return Promise.all(nights.map(getDayAvailability));
  }
  return fetchCalendarRange(checkIn, lastNight);
}
