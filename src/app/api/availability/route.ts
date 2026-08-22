import { NextResponse } from "next/server";
import { getMonthAvailability } from "@/lib/beds24/availability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Invalid or missing 'month' (expected YYYY-MM)" }, { status: 400 });
  }

  const days = await getMonthAvailability(month);
  return NextResponse.json(
    { days },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=30" } }
  );
}
