import "server-only";
import nodemailer from "nodemailer";

export const EMAIL_CONFIGURED = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

let cachedTransporter: nodemailer.Transporter | null = null;

/**
 * Lazily-constructed SMTP transporter, sending through the property owner's
 * own Gmail account via an app password. Only ever imported from Route
 * Handlers (enforced by "server-only") so the credentials never reach the
 * browser bundle. Gmail SMTP (rather than a third-party email API) was
 * chosen so this works without owning a custom domain to verify.
 */
function getTransporter(): nodemailer.Transporter {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not configured in .env.local.");
  }
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return cachedTransporter;
}

export async function sendContactEmail(params: {
  to: string;
  name: string;
  fromEmail: string;
  message: string;
}): Promise<void> {
  const { to, name, fromEmail, message } = params;
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Kamakura Gate Inn Webサイト" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: fromEmail,
    subject: `【お問い合わせ】${name}様より`,
    text: `${name} (${fromEmail}) からお問い合わせがありました。\n\n${message}`,
  });
}
