import { NextRequest, NextResponse } from "next/server";
import { fetchYouTubeTrending } from "@/lib/fetchers/youtube";
import { fetchTikTokTrending } from "@/lib/fetchers/tiktok";
import { fetchRedditTrending } from "@/lib/fetchers/reddit";
import { fetchInstagramTrending } from "@/lib/fetchers/instagram";
import { fetchTwitterTrending } from "@/lib/fetchers/twitter";
import { fetchGoogleTrends } from "@/lib/fetchers/google-trends";
import { analyseItems, generateEditorNote } from "@/lib/ai/analyse";
import { getCachedDigest, setCachedDigest, todayKey } from "@/lib/cache";
import type { DailyDigest } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? todayKey();
  const forceRefresh = searchParams.get("refresh") === "true";

  // Serve from cache
  if (!forceRefresh) {
    const cached = await getCachedDigest(date);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT", "Cache-Control": "public, s-maxage=3600" },
      });
    }
  }

  // Fetch all platforms in parallel
  const [youtube, tiktok, reddit, instagram, twitter, google] = await Promise.allSettled([
    fetchYouTubeTrending(5),
    fetchTikTokTrending(5),
    fetchRedditTrending(5),
    fetchInstagramTrending(5),
    fetchTwitterTrending(5),
    fetchGoogleTrends(5),
  ]);

  const resolve = <T>(r: PromiseSettledResult<T>, fallback: T): T =>
    r.status === "fulfilled" ? r.value : fallback;

  const platforms = {
    youtube: resolve(youtube, []),
    tiktok: resolve(tiktok, []),
    reddit: resolve(reddit, []),
    instagram: resolve(instagram, []),
    twitter: resolve(twitter, []),
    google: resolve(google, []),
  };

  // AI analyse top YouTube items (most expensive, limit scope)
  if (process.env.ANTHROPIC_API_KEY) {
    platforms.youtube = await analyseItems(platforms.youtube);
  }

  // Find top story (highest view count across all platforms)
  const allItems = Object.values(platforms).flat();
  const topStory = allItems.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))[0];

  const digest: DailyDigest = {
    date,
    generatedAt: new Date().toISOString(),
    platforms,
    topStory,
    editorNote: "",
  };

  // Generate AI editor note
  if (process.env.ANTHROPIC_API_KEY) {
    digest.editorNote = await generateEditorNote(digest);
  } else {
    digest.editorNote = "Today's trends reflect the continued dominance of short-form video and community-driven content across every major platform.";
  }

  await setCachedDigest(digest);

  return NextResponse.json(digest, {
    headers: { "X-Cache": "MISS", "Cache-Control": "public, s-maxage=3600" },
  });
}
