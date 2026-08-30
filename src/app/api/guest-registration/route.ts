import { NextResponse } from "next/server";
import { recordGuestRegistration } from "@/lib/beds24/bookings";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const bookingId = Number(body?.bookingId);
  const address = typeof body?.address === "string" ? body.address.trim() : "";
  const occupation = typeof body?.occupation === "string" ? body.occupation.trim() : "";
  const hasJapanAddress = Boolean(body?.hasJapanAddress);
  const nationality = typeof body?.nationality === "string" ? body.nationality.trim() : "";
  const passportNumber = typeof body?.passportNumber === "string" ? body.passportNumber.trim() : "";

  if (!bookingId || !address || !occupation) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!hasJapanAddress && (!nationality || !passportNumber)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    await recordGuestRegistration(bookingId, {
      address,
      occupation,
      hasJapanAddress,
      nationality: hasJapanAddress ? undefined : nationality,
      passportNumber: hasJapanAddress ? undefined : passportNumber,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guest registration failed", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
