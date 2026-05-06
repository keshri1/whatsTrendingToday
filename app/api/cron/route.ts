import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const today = new Date().toISOString().split("T")[0];

  const res = await fetch(`${base}/api/trends?date=${today}&refresh=true`);
  const data = await res.json();

  return NextResponse.json({
    ok: true,
    date: today,
    platforms: Object.entries(data.platforms ?? {}).map(([k, v]) => ({
      platform: k,
      count: (v as unknown[]).length,
    })),
  });
}
