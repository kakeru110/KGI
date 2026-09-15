import "server-only";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BOOKING_NOTIFICATION_EMAIL = process.env.BOOKING_NOTIFICATION_EMAIL;

/**
 * Notifies the owner by email when a new direct booking is created, via
 * Resend's HTTP API. Falls back to a silent no-op if RESEND_API_KEY or
 * BOOKING_NOTIFICATION_EMAIL isn't set, and never throws - a notification
 * failure must not break the booking flow that triggers it.
 */
export async function sendBookingNotificationEmail(params: {
  bookingId: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
}): Promise<void> {
  if (!RESEND_API_KEY || !BOOKING_NOTIFICATION_EMAIL) return;

  const { bookingId, guestName, checkIn, checkOut, guests, total } = params;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kamakura Gate Inn <notifications@kamakuragateinn.com>",
        to: [BOOKING_NOTIFICATION_EMAIL],
        subject: `新規予約: ${guestName}様 (${checkIn}〜${checkOut})`,
        text: [
          "自社サイトで新しい予約が入りました。",
          "",
          `予約ID: ${bookingId}`,
          `お名前: ${guestName}`,
          `チェックイン: ${checkIn}`,
          `チェックアウト: ${checkOut}`,
          `人数: ${guests}名`,
          `金額: ¥${total.toLocaleString("ja-JP")}`,
          "",
          "詳細はBeds24でご確認ください。",
        ].join("\n"),
      }),
    });
  } catch {
    // Swallow errors - see the doc comment above.
  }
}
