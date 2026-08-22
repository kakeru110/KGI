import { NextResponse } from "next/server";
import { getOffer } from "@/lib/beds24/offers";
import { getStripeClient } from "@/lib/stripe/client";
import { isLocale } from "@/lib/i18n/config";

type CheckoutRequestBody = {
  locale: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

function isValidBody(body: unknown): body is CheckoutRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.locale === "string" &&
    typeof b.checkIn === "string" &&
    typeof b.checkOut === "string" &&
    typeof b.adults === "number" &&
    typeof b.children === "number" &&
    typeof b.firstName === "string" &&
    b.firstName.trim().length > 0 &&
    typeof b.lastName === "string" &&
    b.lastName.trim().length > 0 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.phone === "string" &&
    b.phone.trim().length > 0
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  if (!isValidBody(body) || !isLocale(body.locale)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Never trust a client-supplied price - re-derive the total from Beds24
  // right before creating the Stripe session (spec section 26).
  const offer = await getOffer({
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests: { adults: body.adults, children: body.children },
  });
  if (!offer.available) {
    return NextResponse.json({ error: "unavailable" }, { status: 409 });
  }

  const origin = new URL(request.url).origin;
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: body.locale === "ja" ? "ja" : "en",
    customer_email: body.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "jpy",
          // JPY is a zero-decimal currency for Stripe - this is the whole-yen amount, not cents.
          unit_amount: offer.total,
          product_data: {
            name: "Kamakura Gate Inn",
            description: `${offer.checkIn} - ${offer.checkOut} / ${offer.guests} guests`,
          },
        },
      },
    ],
    metadata: {
      checkIn: offer.checkIn,
      checkOut: offer.checkOut,
      adults: String(body.adults),
      children: String(body.children),
      total: String(offer.total),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
    },
    success_url: `${origin}/${body.locale}/booking/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${body.locale}/booking/guest-info?checkin=${offer.checkIn}&checkout=${offer.checkOut}&adults=${body.adults}&children=${body.children}`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
  return NextResponse.json({ url: session.url });
}
