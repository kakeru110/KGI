import { NextResponse } from "next/server";
import { getOffer } from "@/lib/beds24/offers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkin");
  const checkOut = searchParams.get("checkout");
  const adults = Number(searchParams.get("adults") ?? "0");
  const children = Number(searchParams.get("children") ?? "0");

  if (!checkIn || !checkOut || !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
    return NextResponse.json({ error: "Invalid or missing checkin/checkout (expected YYYY-MM-DD)" }, { status: 400 });
  }

  // Final pre-booking confirmation must always re-fetch (no cache) per spec
  // section 26 - the site's own display is never treated as inventory truth.
  const offer = await getOffer({ checkIn, checkOut, guests: { adults, children } });
  return NextResponse.json(offer, { headers: { "Cache-Control": "no-store" } });
}
