import type { DailyDigest, Platform } from "@/types";
import { PLATFORM_CONFIG } from "@/types";
import TrendCard from "./TrendCard";
import EditorNote from "./EditorNote";
import TopStoryHero from "./TopStoryHero";
import { getCachedDigest, setCachedDigest, todayKey } from "@/lib/cache";
import { fetchYouTubeTrending } from "@/lib/fetchers/youtube";
import { fetchTikTokTrending } from "@/lib/fetchers/tiktok";
import { fetchRedditTrending } from "@/lib/fetchers/reddit";
import { fetchInstagramTrending } from "@/lib/fetchers/instagram";
import { fetchTwitterTrending } from "@/lib/fetchers/twitter";
import { fetchGoogleTrends } from "@/lib/fetchers/google-trends";
import { analyseItems, generateEditorNote } from "@/lib/ai/analyse";

async function getDigest(date: string): Promise<DailyDigest | null> {
  try {
    // Always try cache first
    const cached = await getCachedDigest(date);
    if (cached) return cached;

    // Only fetch live data for today (past dates are cache-only)
    if (date !== todayKey()) return null;

    // Fetch all platforms in parallel — direct function calls, no HTTP
    const [youtube, tiktok, reddit, instagram, twitter, google] =
      await Promise.allSettled([
        fetchYouTubeTrending(5),
        fetchTikTokTrending(5),
        fetchRedditTrending(5),
        fetchInstagramTrending(5),
        fetchTwitterTrending(5),
        fetchGoogleTrends(5),
      ]);

    const resolve = <T,>(r: PromiseSettledResult<T>, fallback: T): T =>
      r.status === "fulfilled" ? r.value : fallback;

    const platforms = {
      youtube:   resolve(youtube,   []),
      tiktok:    resolve(tiktok,    []),
      reddit:    resolve(reddit,    []),
      instagram: resolve(instagram, []),
      twitter:   resolve(twitter,   []),
      google:    resolve(google,    []),
    };

    // AI analysis on YouTube (most valuable, most expensive — limit scope)
    if (process.env.ANTHROPIC_API_KEY) {
      platforms.youtube = await analyseItems(platforms.youtube);
    }

    const allItems = Object.values(platforms).flat();
    const topStory = [...allItems].sort(
      (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)
    )[0];

    const digest: DailyDigest = {
      date,
      generatedAt: new Date().toISOString(),
      platforms,
      topStory,
      editorNote: "",
    };

    if (process.env.ANTHROPIC_API_KEY) {
      digest.editorNote = await generateEditorNote(digest);
    } else {
      digest.editorNote =
        "Today's trends reflect the continued dominance of short-form video and community-driven content across every major platform.";
    }

    await setCachedDigest(digest);
    return digest;
  } catch (err) {
    console.error("[TrendGrid] getDigest failed:", err);
    return null;
  }
}

const PLATFORM_ORDER: Platform[] = ["youtube", "tiktok", "reddit", "instagram", "twitter", "google"];

export default async function TrendGrid({ date }: { date: string }) {
  const digest = await getDigest(date);
  if (!digest) {
    return (
      <div className="text-center py-24" role="status">
        <p className="text-4xl mb-4" aria-hidden="true">🔍</p>
        <p style={{ color: "var(--ink-muted)" }}>No data available for this date yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Editor note */}
      {digest.editorNote && <EditorNote note={digest.editorNote} generatedAt={digest.generatedAt} />}

      {/* Top story hero */}
      {digest.topStory && <TopStoryHero item={digest.topStory} />}

      {/* Platform sections */}
      <div className="space-y-16">
        {PLATFORM_ORDER.map((platform) => {
          const items = digest.platforms[platform];
          if (!items?.length) return null;
          const cfg = PLATFORM_CONFIG[platform];

          return (
            <section
              key={platform}
              aria-labelledby={`section-${platform}`}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{
                    background: `${cfg.accentHex}15`,
                    border: `0.5px solid ${cfg.accentHex}40`,
                  }}
                  aria-hidden="true"
                >
                  {cfg.icon}
                </div>
                <div>
                  <h2
                    id={`section-${platform}`}
                    className={`font-display text-3xl tracking-wide text-gradient-${platform === "twitter" ? "tw" : platform === "instagram" ? "ig" : platform}`}
                  >
                    {cfg.label.toUpperCase()}
                  </h2>
                  <p className="text-xs font-mono" style={{ color: "var(--ink-faint)" }}>
                    Top {items.length} trending
                  </p>
                </div>
              </div>

              {/* Cards grid */}
              <div
                role="list"
                aria-label={`Trending on ${cfg.label}`}
                className="grid gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                }}
              >
                {items.map((item) => (
                  <TrendCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}