import { NextRequest, NextResponse } from "next/server";
import { getCachedDigest } from "@/lib/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: { date: string } }
) {
  const { date } = params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
  }

  const digest = await getCachedDigest(date);
  if (!digest) {
    return NextResponse.json({ error: "No data for this date." }, { status: 404 });
  }

  return NextResponse.json(digest, {
    headers: { "Cache-Control": "public, s-maxage=86400" },
  });
}
