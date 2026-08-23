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

- `POST /api/webhooks/stripe` — a `checkout.session.completed` webhook
  that also creates the booking, independent of whether the guest's
  browser ever makes it back to `/booking/confirm`. Both paths call the
  same `completeBookingFromSession()` (`src/lib/checkout.ts`), and
  `createBooking()`'s de-dupe check makes it safe for both to fire for
  the same session.

Set `STRIPE_SECRET_KEY` in `.env.local` (test mode `sk_test_...` while
verifying the flow, live mode `sk_live_...` once ready to accept real
payments). The webhook additionally needs `STRIPE_WEBHOOK_SECRET` — see
`env.example` for how to get one; the site works without it (the confirm
page still creates bookings on its own), but the webhook is the more
reliable path and should be configured before relying on this for real
payments.

## Contact form

`/[locale]/contact` sends inquiries by email via `src/lib/email/client.ts`,
using the property owner's own Gmail account over SMTP (an app password,
not a third-party email API) so it works without owning a custom domain.

- `POST /api/contact` — validates the form, then emails
  `BUSINESS_INFO.email` (`src/lib/business-info.ts`) with the guest's
  message; `replyTo` is set to the guest's address so replying goes
  straight to them.

Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env.local` — see
`env.example` for how to generate an app password. Without both set, the
form shows an error instead of silently failing.

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
  booking on successful payment (also backed by a webhook, see above).
- `/policy`: cancellation policy, linked as a required checkbox on the
  guest-info form before checkout.
- `/tokushoho`: legal disclosure page (Japan's Act on Specified
  Commercial Transactions) — **the business details in
  `src/lib/business-info.ts` are still empty placeholders**, see below.
- `/rooms`, `/gallery`, `/access`, `/faq`, `/contact` (emails inquiries
  to the property owner, see above).
- Japanese (`/ja`) and English (`/en`) locales.
- Mobile-first, with a sticky bottom CTA bar.

Photos are placeholder gradient tiles (see `src/lib/photos.ts`) — swap
in real photography before launch.

## Before going live (needs the site owner, not just code)

- **Fill in `src/lib/business-info.ts`** (operator name, representative,
  address, phone, email) — required for the `/tokushoho` legal page.
  Missing fields currently render as "(未設定)" so it's obvious if this
  was skipped.
- **Review `/policy`'s cancellation terms** (`src/lib/i18n/dictionaries/{ja,en}.ts`,
  the `policy.cancellationRules` arrays) — the current wording is a
  placeholder default (free cancellation 7+ days out, 50% at 2-6 days,
  100% inside 1 day / no-show), not a business decision this code can
  make on its own.
- **Register the Stripe webhook**: Stripe dashboard → Developers →
  Webhooks → add endpoint `https://<your-domain>/api/webhooks/stripe`
  for the `checkout.session.completed` event, then put its signing
  secret in `STRIPE_WEBHOOK_SECRET`. This needs a real deployed URL —
  it can't be registered against `localhost`.
- **Switch `STRIPE_SECRET_KEY` to a live key** only after testing the
  full flow in test mode (a real Stripe test payment + a real Beds24
  test booking, cancelled and deleted afterward, is a good way to
  confirm this — see the git history of this branch for exactly how
  that was verified).
- Confirm whether any additional 特定商取引法 disclosure fields apply
  beyond what's on `/tokushoho` (e.g. return/refund conditions specific
  to accommodation services can have extra nuance) — worth a quick check
  with a tax/legal advisor before launch, since this code can draft the
  page but can't give legal sign-off.
