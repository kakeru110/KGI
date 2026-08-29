"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { GaEvent } from "@/lib/analytics";

/**
 * Module-level rather than a ref, so a client-side navigation back to the
 * same step - or React's double-invoked effects in development - re-mounts
 * this component without re-sending an event that already went out.
 */
const sent = new Set<string>();

/**
 * Sends one GA4 event when it mounts, and renders nothing. The booking
 * funnel's pages are server components that already hold the offer or
 * booking the event describes, so they build the event (see
 * @/lib/analytics) and hand it to this to actually fire from the browser.
 */
export default function AnalyticsEvent({ event }: { event: GaEvent }) {
  useEffect(() => {
    // No GA property configured (local dev, or before NEXT_PUBLIC_GA_ID is
    // set): the layout renders no gtag at all, and sendGAEvent would just
    // warn to the console that GA was never initialized.
    if (!process.env.NEXT_PUBLIC_GA_ID) return;
    if (sent.has(event.dedupeKey)) return;
    sent.add(event.dedupeKey);
    sendGAEvent("event", event.name, event.params);
  }, [event]);

  return null;
}
