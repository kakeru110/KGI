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
 * Sends the guest the full pre-stay guide (self-check-in, Wi-Fi, access,
 * parking, house rules, emergency contact) right after a new direct
 * booking is created. The exact wording is business copy supplied by the
 * property owner - kept verbatim rather than reworded. Sent in the same
 * locale they booked in - see the `locale` field added to the Stripe
 * Checkout Session metadata in src/app/api/checkout/route.ts. Uses
 * `reply_to` so a guest hitting "reply" reaches the property management
 * company's inbox (already wired into their Slack) rather than the
 * unmonitored `from` address, and `bcc`s that same inbox so they also
 * see the outbound email itself (via `bcc`, not `cc`, so the guest never
 * sees that address in the headers). The `from` domain itself stays
 * kamakuragateinn.com, since Resend only allows sending from a domain
 * DNS-verified in our own account, and good-neighbors.link is theirs,
 * not ours.
 *
 * Deliberately does not mention the Beds24 booking ID / dates / price
 * (the source text doesn't reference them - it's a stay guide, not a
 * receipt) or the guest-registration link (the source text says that's
 * sent in a separate, later message, which isn't built yet).
 */
export async function sendGuestConfirmationEmail(params: {
  to: string;
  guestName: string;
  locale: "ja" | "en";
  bookingId: number;
}): Promise<void> {
  if (!RESEND_API_KEY) return;

  const { to, guestName, locale, bookingId } = params;
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
        bcc: [GUEST_REPLY_TO_EMAIL],
        to: [to],
        subject: isJa
          ? `【Kamakura Gate Inn】ご予約ありがとうございます（予約ID: ${bookingId}）`
          : `Kamakura Gate Inn - Booking confirmed (#${bookingId})`,
        text: isJa
          ? [
              `${guestName} 様`,
              "",
              "この度はKamakura Gate Innをご予約いただき、誠にありがとうございます。",
              "数ある宿泊施設の中からお選びいただきましたこと、心より御礼申し上げます。",
              "ご滞在に関する大切なご案内をお送りいたします。ご確認をお願いいたします。",
              "",
              "【チェックイン・チェックアウト】",
              "チェックイン 15:00~",
              "チェックアウト ~11:00",
              "",
              "当施設はセルフチェックイン方式を採用しております。",
              "ご到着時、スタッフは常駐しておりませんので、ご自身でご入室いただく形となります。",
              "事前に必要な情報は順次ご案内いたしますので、ご安心ください。",
              "",
              "【Wi-Fiについて】",
              "当施設では無料Wi-Fiをご利用いただけます。",
              "パスワード等の詳細は室内にご案内をご用意しておりますので、到着後すぐにご利用いただけます。",
              "",
              "【アクセス】",
              "●大船駅より徒歩7分",
              "https://1drv.ms/b/c/8f360ba3e23fff25/IQAT1I6sAMObSLXgNS07xz22AVAMbUD3C4NonYjFx3IAiGY?e=LZelef",
              "●施設までのルート検索",
              "https://maps.app.goo.gl/ME7SS9YpuGiZ1KUFA",
              "",
              "ご不明な場合はお気軽にご連絡ください。",
              "",
              "【宿泊者情報の事前入力】",
              "当施設はセルフチェックインのため、事前に宿泊者情報のご入力が必要となります。",
              "入力方法につきましては、あらためてご案内をお送りいたします。",
              "",
              "【駐車場について】",
              "誠に恐れ入りますが、専用駐車場のご用意はございません。",
              "お車でお越しの際は、近隣のコインパーキングをご利用ください。",
              "",
              "○最寄りのコインパーキング",
              "・タイムズセサミスポーツクラブ大船",
              "　神奈川県横浜市栄区笠間2-14",
              "",
              "【スマートロック番号】",
              "入口のスマートロック番号は、防犯上の理由により、ご宿泊日が近づきましたら改めてお送りいたします。",
              "",
              "【近隣へのご配慮のお願い】",
              "当施設は住宅地に位置しております。",
              "皆さまに気持ちよくお過ごしいただくため、以下の点にご協力をお願いいたします。",
              "",
              "・夜間の騒音には十分ご配慮ください",
              "・館内および敷地内は火気厳禁です",
              "・花火・喫煙はご遠慮いただいております",
              "",
              "万が一、騒音に関する苦情や火気使用が確認された場合には、現地対応および駆けつけ費用をご請求させていただく場合がございます。",
              "何卒ご理解とご協力をお願い申し上げます。",
              "",
              "【緊急連絡先】",
              "ご不明点やお困りのことがございましたら、下記までご連絡くださいませ。",
              "080-2117-3217（午前9時-午後10時まで対応）",
              "",
              "それでは、ご宿泊の日程が近づきましたら、改めて詳細のご案内をお送りいたします。",
              "Kamakura Gate Innでのご滞在が快適なものとなりますよう、準備してお待ちしております。",
              "",
              "Kamakura Gate Inn",
            ].join("\n")
          : [
              `Dear ${guestName},`,
              "",
              "Thank you very much for booking your stay with Kamakura Gate Inn.",
              "We truly appreciate you choosing us among the many accommodations available.",
              "Please find below some important information about your stay - kindly take a moment to review it.",
              "",
              "[Check-in / Check-out]",
              "Check-in: from 3:00 PM",
              "Check-out: until 11:00 AM",
              "",
              "Our property uses self-check-in.",
              "No staff will be on-site when you arrive, so you will let yourself in.",
              "We'll send you the details you need in advance, so please don't worry.",
              "",
              "[Wi-Fi]",
              "Free Wi-Fi is available at the property.",
              "The password and other details are provided inside the room, so you can connect as soon as you arrive.",
              "",
              "[Access]",
              "- 7-minute walk from Ofuna Station",
              "https://1drv.ms/b/c/8f360ba3e23fff25/IQAT1I6sAMObSLXgNS07xz22AVAMbUD3C4NonYjFx3IAiGY?e=LZelef",
              "- Route search to the property",
              "https://maps.app.goo.gl/ME7SS9YpuGiZ1KUFA",
              "",
              "If anything is unclear, please feel free to contact us.",
              "",
              "[Pre-arrival guest registration]",
              "As this is a self-check-in property, we're required to collect some information about each guest in advance.",
              "We'll send details on how to register separately, closer to your stay.",
              "",
              "[Parking]",
              "We're sorry, but the property does not have dedicated parking.",
              "If you're arriving by car, please use a nearby coin (pay-and-display) parking lot.",
              "",
              "Nearest coin parking:",
              "- Times Sesami Sports Club Ofuna",
              "  2-14 Kasama, Sakae-ku, Yokohama, Kanagawa",
              "",
              "[Smart lock code]",
              "For security reasons, we'll send the entrance smart lock code separately as your stay date approaches.",
              "",
              "[A request regarding our neighbors]",
              "The property is located in a residential area.",
              "To help everyone enjoy their stay, we ask for your cooperation with the following:",
              "",
              "- Please be mindful of noise at night",
              "- Open flames are strictly prohibited inside the property and on the grounds",
              "- Fireworks and smoking are not permitted",
              "",
              "If a noise complaint or use of open flames is confirmed, we may need to respond on-site and may charge a corresponding call-out fee.",
              "We appreciate your understanding and cooperation.",
              "",
              "[Emergency contact]",
              "If you have any questions or run into trouble, please contact us at the number below.",
              "080-2117-3217 (available 9:00 AM - 10:00 PM, Japan time)",
              "",
              "We'll send further details as your stay approaches.",
              "We look forward to welcoming you and hope your stay at Kamakura Gate Inn is a comfortable one.",
              "",
              "Kamakura Gate Inn",
            ].join("\n"),
      }),
    });
  } catch {
    // Swallow errors - see the doc comment on sendBookingNotificationEmail.
  }
}
