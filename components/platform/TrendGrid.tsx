import type { DailyDigest, Platform } from "@/types";
import { PLATFORM_CONFIG } from "@/types";
import TrendCard from "./TrendCard";
import EditorNote from "./EditorNote";
import TopStoryHero from "./TopStoryHero";

async function getDigest(date: string): Promise<DailyDigest | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/trends?date=${date}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
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
