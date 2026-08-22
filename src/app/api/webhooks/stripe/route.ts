import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/client";
import { completeBookingFromSession } from "@/lib/checkout";

/**
 * Stripe calls this after a payment event, independent of whether the
 * guest's browser ever makes it back to /booking/confirm - this is what
 * makes booking creation reliable if they close the tab right after
 * paying. Register this endpoint's URL in the Stripe dashboard
 * (Developers > Webhooks) for the `checkout.session.completed` event and
 * put the resulting signing secret in STRIPE_WEBHOOK_SECRET.
 *
 * completeBookingFromSession() de-dupes by email + arrival, so it's safe
 * for this to run for a session /booking/confirm already handled (or vice
 * versa) - whichever fires first creates the booking.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${err}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await completeBookingFromSession(event.data.object);
  }

  return NextResponse.json({ received: true });
}
