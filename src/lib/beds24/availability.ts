import "server-only";
import { USE_MOCK_DATA } from "./client";
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

/**
 * Returns availability + indicative base price for every day in the given
 * month (format YYYY-MM). Backed by deterministic mock data until
 * BEDS24_API_KEY is configured, at which point this should call
 * `GET /inventory/rooms/calendar` (or `/availability`) for PROPERTY_ID.
 */
export async function getMonthAvailability(yearMonth: string): Promise<DayAvailability[]> {
  if (USE_MOCK_DATA) {
    return daysInMonth(yearMonth).map(mockDayAvailability);
  }

  // TODO: replace with a real Beds24 API V2 call once credentials exist.
  // return beds24Fetch<DayAvailability[]>("/inventory/rooms/calendar", {
  //   query: { propertyId: PROPERTY_ID, startDate: `${yearMonth}-01`, endDate: ... },
  // });
  throw new Error("Beds24 live availability integration not implemented yet.");
}

export async function getDayAvailability(date: string): Promise<DayAvailability> {
  if (USE_MOCK_DATA) {
    return mockDayAvailability(date);
  }
  const month = date.slice(0, 7);
  const days = await getMonthAvailability(month);
  const day = days.find((d) => d.date === date);
  if (!day) throw new Error(`No availability data for ${date}`);
  return day;
}

export async function getRangeAvailability(
  checkIn: string,
  checkOut: string
): Promise<DayAvailability[]> {
  const nights: string[] = [];
  const cursor = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (cursor < end) {
    nights.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return Promise.all(nights.map(getDayAvailability));
}
