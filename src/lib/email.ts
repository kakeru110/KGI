import "server-only";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * The property management company's inbox - already wired into their
 * Slack notifications for OTA guest messages. Guest replies to our
 * confirmation email land here too, so all guest communication funnels
 * into the one channel their team already watches.
 */
const GUEST_REPLY_TO_EMAIL = "fika2-ofuna@good-neighbors.link";
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

/**
 * Thanks the guest for a new direct booking and points them to the
 * standalone guest-registration page (not the ephemeral Stripe
 * session_id flow on /booking/confirm, so the link still works if they
 * come back to it later). Sent in the same locale they booked in - see
 * the `locale` field added to the Stripe Checkout Session metadata in
 * src/app/api/checkout/route.ts. Uses `reply_to` so a guest hitting
 * "reply" reaches the property management company's inbox (already
 * wired into their Slack) rather than the unmonitored `from` address -
 * the `from` domain itself stays kamakuragateinn.com, since Resend only
 * allows sending from a domain DNS-verified in our own account, and
 * good-neighbors.link is theirs, not ours.
 */
export async function sendGuestConfirmationEmail(params: {
  to: string;
  guestName: string;
  locale: "ja" | "en";
  bookingId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  registrationUrl: string;
}): Promise<void> {
  if (!RESEND_API_KEY) return;

  const { to, guestName, locale, bookingId, checkIn, checkOut, guests, total, registrationUrl } = params;
  const isJa = locale === "ja";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kamakura Gate Inn <notifications@kamakuragateinn.com>",
        reply_to: [GUEST_REPLY_TO_EMAIL],
        to: [to],
        subject: isJa
          ? `【Kamakura Gate Inn】ご予約ありがとうございます（予約ID: ${bookingId}）`
          : `Kamakura Gate Inn - Booking confirmed (#${bookingId})`,
        text: isJa
          ? [
              `${guestName} 様`,
              "",
              "この度はKamakura Gate Innにご予約いただき、誠にありがとうございます。",
              "",
              `予約ID: ${bookingId}`,
              `チェックイン: ${checkIn}`,
              `チェックアウト: ${checkOut}`,
              `人数: ${guests}名`,
              `金額: ¥${total.toLocaleString("ja-JP")}`,
              "",
              "旅館業法に基づき、ご宿泊者様の情報（お名前・ご住所など）のご登録をお願いしております。",
              "下記リンクよりご登録ください。",
              registrationUrl,
              "",
              "ご不明な点がございましたら、このメールにご返信ください。",
              "",
              "Kamakura Gate Inn",
            ].join("\n")
          : [
              `Dear ${guestName},`,
              "",
              "Thank you for booking with Kamakura Gate Inn.",
              "",
              `Booking reference: ${bookingId}`,
              `Check-in: ${checkIn}`,
              `Check-out: ${checkOut}`,
              `Guests: ${guests}`,
              `Total: ¥${total.toLocaleString("en-US")}`,
              "",
              "Japanese law requires us to record some information about each guest",
              "(name, address, etc.) before your stay. Please complete your",
              "registration using the link below.",
              registrationUrl,
              "",
              "If you have any questions, just reply to this email.",
              "",
              "Kamakura Gate Inn",
            ].join("\n"),
      }),
    });
  } catch {
    // Swallow errors - see the doc comment on sendBookingNotificationEmail.
  }
}
