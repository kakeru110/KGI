# Kamakura Gate Inn — Official Booking Site

A direct-booking site for Kamakura Gate Inn, built with Next.js (App
Router) + TypeScript + Tailwind CSS. Availability and pricing come from
Beds24 (property ID `309861`), and guests can complete a booking and
payment entirely on-site via Stripe.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/ja` or `/en` based on
the browser's `Accept-Language` header.

Copy `env.example` to `.env.local` and fill in real credentials to use
live data (see below). Without them, the site runs on deterministic
dummy availability/pricing data, and the booking flow won't be able to
create real bookings or charge real payments.

## Beds24 integration

All Beds24 access lives under `src/lib/beds24/`:

- `client.ts` — Beds24 API V2 client (server-only, never bundled for the
  browser). Handles the refresh-token → access-token exchange.
- `property-config.ts` — plain, non-secret capacity/pricing constants
  (safe to import from client components too).
- `availability.ts` — `GET /inventory/rooms/calendar` for the
  availability calendar (cached ~60s, per spec section 25).
- `offers.ts` — `GET /inventory/rooms/offers` for authoritative pricing.
  Beds24 already applies its own configured per-extra-guest surcharge;
  this module asks it directly rather than recomputing that locally, and
  only adds the cleaning fee (a local constant, since Beds24 doesn't
  fold it into offer pricing). Never cached (money-sensitive).
- `bookings.ts` — `POST /bookings` to create a confirmed booking after
  payment succeeds, with a `GET /bookings` de-dupe check by email +
  arrival date so a reloaded confirmation page can't create a duplicate.
  Also builds the legacy Beds24 hosted-booking-page URL
  (`buildExternalBookingUrl`, currently unused by the main flow, kept as
  a fallback reference).

Until `BEDS24_REFRESH_TOKEN` is set (see `env.example`), all of the above
serve deterministic dummy data with the same shape the real API returns.

UI components never call Beds24 directly: pages/Route Handlers own that,
and thin Route Handlers (`/api/availability`, `/api/offers`) front the
data layer for client components like the interactive booking widget.

### Getting a Beds24 API V2 refresh token

1. Beds24 dashboard → Marketplace → API → "Generate invite code"
2. Scopes needed: `read:bookings`, `write:bookings`,
   `read:bookings-personal`, `write:bookings-personal`, `read:inventory`,
   `read:properties`, scoped to property 309861
3. Exchange the invite code (valid 24h) for a refresh token:
   `GET https://beds24.com/api/v2/authentication/setup` with header
   `code: <invite code>` — the response's `refreshToken` goes into
   `.env.local`.

## Stripe integration

`src/lib/stripe/client.ts` wraps the Stripe SDK (server-only). The
booking flow uses a hosted Stripe Checkout Session rather than
Elements/PaymentIntents directly, so no card data ever touches this
server.

- `POST /api/checkout` — re-verifies the offer against Beds24 (never
  trusts a client-supplied price), then creates a Checkout Session for
  the exact total in JPY (a Stripe zero-decimal currency — amounts are
  whole yen, not cents).
- `/[locale]/booking/confirm` — on return from Stripe, retrieves the
  Checkout Session server-side, and only if `payment_status === "paid"`
  creates the real Beds24 booking and shows a confirmation with the
  booking ID.

There is currently no Stripe webhook — payment confirmation happens when
the guest's browser lands back on the success URL. This is simpler to
run without a public URL for local development, but means a booking
won't be created if the guest closes their browser right after paying
before being redirected back. **Before relying on this in production,
add a `checkout.session.completed` webhook** that also calls
`createBooking()`, so payment confirmation doesn't depend on the guest's
browser completing the redirect.

Set `STRIPE_SECRET_KEY` in `.env.local` (test mode `sk_test_...` while
verifying the flow, live mode `sk_live_...` once ready to accept real
payments).

## Booking flow

```
Guest picks dates/guests
  → /booking (price breakdown from Beds24, incl. per-person price)
  → /booking/guest-info (name / email / phone)
  → /api/checkout (re-verifies price, creates Stripe Checkout Session)
  → Stripe-hosted payment page
  → /booking/confirm (verifies payment, creates the Beds24 booking)
```

## What's implemented

- Top page: hero, live search widget (dates + guests + calendar),
  stats, photo gallery, facility intro, amenities, reviews placeholder.
- `/booking`: availability + full price breakdown (room fee, extra-guest
  fee, cleaning fee, total, per-night, and a prominent per-person price).
- `/booking/guest-info` → Stripe Checkout → `/booking/confirm`: full
  in-site booking + payment flow, creating a real confirmed Beds24
  booking on successful payment.
- `/rooms`, `/gallery`, `/access`, `/faq`.
- Japanese (`/ja`) and English (`/en`) locales.
- Mobile-first, with a sticky bottom CTA bar.

Photos are placeholder gradient tiles (see `src/lib/photos.ts`) — swap
in real photography before launch.

## Before going live

- Add a Stripe webhook for `checkout.session.completed` (see above) so
  booking creation doesn't depend on the browser redirect completing.
- Switch `STRIPE_SECRET_KEY` to a live key only after testing the full
  flow (a real Stripe test payment + a real Beds24 test booking,
  cancelled and deleted afterward, is a good way to confirm this).
- Add a cancellation policy and terms of service, referenced from the
  guest-info page — not included yet.
- Confirm Japan's 特定商取引法 (Act on Specified Commercial
  Transactions) disclosure requirements for online sales and add the
  required disclosure page if applicable.
