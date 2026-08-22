import "server-only";

/**
 * Beds24 API V2 base URL. Real credentials must never reach the browser -
 * every call into this module tree happens from Route Handlers / Server
 * Components only (enforced by the `server-only` import above).
 */
export const BEDS24_API_BASE = "https://api.beds24.com/v2";

/** Legacy hosted booking page used for the Phase 1 handoff (see bookings.ts). */
export const LEGACY_BOOKING_PAGE_URL = "https://beds24.com/booking2.php";

/**
 * Set BEDS24_API_KEY / BEDS24_REFRESH_TOKEN in `.env.local` once real
 * credentials are available. Until then USE_MOCK_DATA stays true and
 * availability.ts / offers.ts / bookings.ts serve deterministic dummy
 * data with the exact same shape the real API will return.
 */
export const USE_MOCK_DATA = !process.env.BEDS24_API_KEY;

type Beds24RequestInit = {
  method?: "GET" | "POST";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
};

/**
 * Low-level fetch wrapper for Beds24 API V2. Not yet called anywhere -
 * wired up here so the swap from mock data to the real API only touches
 * availability.ts / offers.ts / bookings.ts, never UI code.
 */
export async function beds24Fetch<T>(path: string, init: Beds24RequestInit = {}): Promise<T> {
  const apiKey = process.env.BEDS24_API_KEY;
  if (!apiKey) {
    throw new Error(
      "BEDS24_API_KEY is not configured. Set USE_MOCK_DATA usage in callers, or add credentials to .env.local."
    );
  }

  const url = new URL(path, BEDS24_API_BASE);
  for (const [key, value] of Object.entries(init.query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      token: apiKey,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    // Short revalidation window per spec section 25 (cache availability ~60s).
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Beds24 API error ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}
