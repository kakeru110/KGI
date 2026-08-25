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

`/[locale]/contact` (`src/components/ContactForm.tsx`) posts straight to
[FormSubmit](https://formsubmit.co)'s AJAX endpoint from the browser -
`https://formsubmit.co/ajax/{BUSINESS_INFO.email}` - which relays the
message to `BUSINESS_INFO.email` (`src/lib/business-info.ts`) by email. No
API route, backend code, or env vars of our own are needed; `_replyto` is
set to the guest's address so replying goes straight to them.

**One-time setup**: FormSubmit emails the recipient an "activate this
form" confirmation link the first time a submission comes in for a given
address - inquiries won't actually arrive until that link is clicked.

## Analytics, SEO and share cards

### GA4 conversion tracking

GA4 itself is loaded in `src/app/[locale]/layout.tsx` whenever
`NEXT_PUBLIC_GA_ID` is set. On top of pageviews, the booking funnel sends
three GA4 ecommerce events (`src/lib/analytics.ts` builds them,
`src/components/AnalyticsEvent.tsx` fires them from the browser):

- `view_item` on `/booking`, once a real bookable price is shown
- `begin_checkout` on `/booking/guest-info`
- `purchase` on `/booking/confirm`, with the Beds24 booking id as
  `transaction_id` and the paid total as `value`

Without these, GA4 can show that people arrive but not which channel
actually produces bookings - which is the only number worth optimising.

**One-time setup in GA4**: Admin > Events > mark `purchase` (and usually
`begin_checkout`) as key events. The custom parameters the events carry
(`check_in`, `check_out`, `nights`, `guests`) are collected either way,
but only appear in reports once registered under Admin > Custom
definitions.

Campaign links should carry UTM parameters so the events attribute
somewhere useful, e.g.
`https://<domain>/ja?utm_source=twitter&utm_medium=social&utm_campaign=launch`.

### Structured data

- Top page: `VacationRental` with address, geo, amenities, price range and
  (when reviews exist) `aggregateRating`, linked to the Google Business
  Profile via `sameAs`.
- `/faq`: `FAQPage`, built from the same dictionary entries the page
  renders (`src/lib/structured-data.ts`).
- `/reviews`: the property's `aggregateRating`, carrying the same `@id` as
  the top page's entity so both describe one property. Deliberately no
  per-review `Review` markup: Beds24's Airbnb/Booking.com review payloads
  carry no reviewer name, and schema.org `Review` requires an `author`.

### Social share cards

`src/app/[locale]/opengraph-image.tsx` and `twitter-image.tsx` generate a
1200x630 card per locale at build time (`src/lib/og-image.tsx` holds the
actual layout): the hero photo, darkened on the left, with the property
name, a one-line tagline (`dict.meta.ogTagline`) and the domain. The
background is `public/og/background.jpg`, pre-cropped to 1200x630 so the
renderer doesn't decode the 4.6MB original once per image.

Japanese text needs real font data - the renderer has no system fonts - so
the card fetches a per-string Shippori Mincho subset from Google Fonts at
build time. The app already fetches from `fonts.googleapis.com` at build
time via `next/font`, so this adds no new failure mode. Note that not
every glyph exists in that face (`㎡` doesn't, for one) - check a rebuilt
card after editing `ogTagline`.

`SITE_X_HANDLE`/`SITE_X_URL` in `src/lib/site.ts` hold the property's X
account (`@kamakuragateinn`): the handle sets
`twitter:site`/`twitter:creator` so a shared card is attributed to the
account, and the profile URL is listed in the top page's structured-data
`sameAs` alongside the Google Business Profile.

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
- GA4 booking-funnel events, FAQ/property structured data, and
  generated per-locale social share cards (see above).
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
- **Mark `purchase` as a key event in GA4** (Admin > Events) - the
  event is sent, but GA4 won't treat it as a conversion until told to.
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
