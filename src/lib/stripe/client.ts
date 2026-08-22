import "server-only";
import Stripe from "stripe";

export const STRIPE_CONFIGURED = Boolean(process.env.STRIPE_SECRET_KEY);

let cachedClient: Stripe | null = null;

/**
 * Lazily-constructed Stripe SDK client. Only ever imported from Route
 * Handlers / Server Components (enforced by "server-only") so the secret
 * key never reaches the browser bundle.
 */
export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured in .env.local.");
  }
  if (!cachedClient) {
    cachedClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return cachedClient;
}
