import { NextResponse } from "next/server";
import { findBookingsAwaitingReviewRequest, markReviewRequestSent } from "@/lib/beds24/bookings";
import { sendReviewRequestEmail } from "@/lib/email";

/** How many days after checkout the review-request email goes out (0 = checkout day itself). */
const REVIEW_REQUEST_DAYS_AFTER_CHECKOUT = 0;

function departureDateNDaysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

/**
 * Runs daily at 20:00 JST (11:00 UTC, see vercel.json) and emails a review
 * request to every direct-site guest checking out that day
 * (REVIEW_REQUEST_DAYS_AFTER_CHECKOUT). Marks each booking as sent (Beds24
 * `custom1`) so a retried or overlapping run can't double-send. Requires
 * CRON_SECRET so this can't be triggered by an arbitrary request to this
 * public URL.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const departureDate = departureDateNDaysAgo(REVIEW_REQUEST_DAYS_AFTER_CHECKOUT);
  const candidates = await findBookingsAwaitingReviewRequest(departureDate);

  let sent = 0;
  for (const candidate of candidates) {
    await sendReviewRequestEmail({
      to: candidate.email,
      guestName: candidate.guestName,
      locale: candidate.locale,
    });
    await markReviewRequestSent(candidate.bookingId);
    sent++;
  }

  return NextResponse.json({ departureDate, candidates: candidates.length, sent });
}
