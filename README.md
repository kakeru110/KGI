# Kamakura Gate Inn — Official Booking Site (Phase 1 MVP)

A direct-booking site for Kamakura Gate Inn, built with Next.js (App
Router) + TypeScript + Tailwind CSS. Availability, pricing, and the
booking itself are backed by Beds24 (property ID `309861`); this site is
the search/marketing front-end that hands off to Beds24's hosted booking
page once a guest has picked dates.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/ja` or `/en` based on
the browser's `Accept-Language` header.

## Beds24 integration

All Beds24 access lives under `src/lib/beds24/`:

- `client.ts` — low-level API V2 fetch wrapper (server-only, never
  bundled for the browser). Real calls are not wired up yet.
- `property-config.ts` — plain, non-secret capacity/pricing constants
  (safe to import from client components too).
- `availability.ts` / `offers.ts` / `bookings.ts` — the data layer the
  UI depends on.

Until `BEDS24_API_KEY` is set (see `env.example`), these modules serve
deterministic dummy data with the exact shape the real API is expected
to return, so swapping in real credentials later should only require
editing the `TODO` blocks inside those three files — no UI or page code
should need to change.

UI components never call Beds24 directly: pages/Route Handlers own that,
and a couple of thin Route Handlers (`/api/availability`, `/api/offers`)
front the data layer for client components like the interactive booking
widget.

## What's implemented (Phase 1)

- Top page: hero, live search widget (dates + guests + calendar),
  stats, photo gallery, facility intro, amenities, reviews placeholder.
- `/booking`: availability + full price breakdown (room fee, extra-guest
  fee, cleaning fee, total, per-night, and a prominent per-person price),
  handing off to the existing Beds24 booking page
  (`https://beds24.com/booking2.php?propid=309861`) with dates/guests
  pre-filled.
- `/rooms`, `/gallery`, `/access`, `/faq`.
- Japanese (`/ja`) and English (`/en`) locales.
- Mobile-first, with a sticky bottom CTA bar.

Photos are placeholder gradient tiles (see `src/lib/photos.ts`) — swap
in real photography before launch.

## Verify the Beds24 handoff URL before launch

`buildExternalBookingUrl` in `src/lib/beds24/bookings.ts` builds the
query string Beds24's hosted booking widget accepts. The exact parameter
names aren't in the public API docs — confirm them against the Beds24
dashboard's "Make Your Own Booking Widget" page before going live.
