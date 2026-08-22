import "server-only";

/**
 * Beds24 API V2 base URL. Real credentials must never reach the browser -
 * every call into this module tree happens from Route Handlers / Server
 * Components only (enforced by the `server-only` import above).
 */
export const BEDS24_API_BASE = "https://beds24.com/api/v2";

/** Legacy hosted booking page used for the Phase 1 handoff (see bookings.ts). */
export const LEGACY_BOOKING_PAGE_URL = "https://beds24.com/booking2.php";

/**
 * Set BEDS24_REFRESH_TOKEN in `.env.local` once real credentials are
 * available. Until then USE_MOCK_DATA stays true and availability.ts /
 * offers.ts / bookings.ts serve deterministic dummy data with the exact
 * same shape the real API returns.
 */
export const USE_MOCK_DATA = !process.env.BEDS24_REFRESH_TOKEN;

type Beds24RequestInit = {
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string | number | boolean | (string | number)[] | undefined>;
  body?: unknown;
  /**
   * Next.js fetch cache revalidation window in seconds. Omit (the default)
   * for money- or inventory-mutating calls - availability.ts opts into
   * 60s caching explicitly per spec section 25; everything else must see
   * fresh data (spec section 26: always re-verify right before booking).
   */
  revalidateSeconds?: number;
};

/**
 * Beds24 V2 auth is a refresh-token flow: the long-lived refresh token
 * (from a one-time invite-code exchange, see README) is exchanged here
 * for a short-lived (24h) access token via GET /authentication/token.
 * Cached in-process so we don't re-exchange on every request; a cold
 * serverless start just pays for one extra round trip.
 */
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const refreshToken = process.env.BEDS24_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("BEDS24_REFRESH_TOKEN is not configured in .env.local.");
  }

  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  const response = await fetch(`${BEDS24_API_BASE}/authentication/token`, {
    headers: { accept: "application/json", refreshToken },
  });
  if (!response.ok) {
    throw new Error(`Beds24 token exchange failed ${response.status}: ${await response.text()}`);
  }
  const { token, expiresIn } = (await response.json()) as { token: string; expiresIn: number };

  // Refresh a minute early so we never fire a request with an expired token.
  cachedAccessToken = { token, expiresAt: Date.now() + (expiresIn - 60) * 1000 };
  return token;
}

/**
 * Low-level fetch wrapper for Beds24 API V2. Used by availability.ts and
 * offers.ts; bookings.ts still only builds the legacy handoff URL (no
 * booking-creation calls are wired up yet).
 */
export async function beds24Fetch<T>(path: string, init: Beds24RequestInit = {}): Promise<T> {
  const accessToken = await getAccessToken();

  const url = new URL(`${BEDS24_API_BASE}${path}`);
  for (const [key, value] of Object.entries(init.query ?? {})) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(key, String(v));
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      token: accessToken,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: init.revalidateSeconds === undefined ? "no-store" : undefined,
    next: init.revalidateSeconds === undefined ? undefined : { revalidate: init.revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`Beds24 API error ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}
