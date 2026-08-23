import { NextResponse } from "next/server";
import { BUSINESS_INFO } from "@/lib/business-info";
import { sendContactEmail } from "@/lib/email/client";

type ContactRequestBody = {
  name: string;
  email: string;
  message: string;
  // Hidden honeypot field - real visitors never fill this in, bots usually do.
  company?: string;
};

function isValidBody(body: unknown): body is ContactRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.message === "string" &&
    b.message.trim().length > 0
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  if (!isValidBody(body)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (body.company) {
    // Honeypot tripped - pretend success so bots don't learn to skip the field.
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactEmail({
      to: BUSINESS_INFO.email,
      name: body.name,
      fromEmail: body.email,
      message: body.message,
    });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json({ error: "send-failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
