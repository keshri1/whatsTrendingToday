import type { TrendItem } from "@/types";

// Google Trends via unofficial npm package
// Falls back to mock if package or network is unavailable
export async function fetchGoogleTrends(count = 5): Promise<TrendItem[]> {
  try {
    // Dynamic import to handle environments where the package isn't installed
    const googleTrends = await import("google-trends-api").catch(() => null);
    if (!googleTrends) return getMockGoogleTrends();

    const result = await googleTrends.default.dailyTrends({ geo: "US" });
    const parsed = JSON.parse(result);
    const trending = parsed?.default?.trendingSearchesDays?.[0]?.trendingSearches ?? [];

    return trending.slice(0, count).map((t: Record<string, unknown>, i: number) => {
      const title = t.title as Record<string, string>;
      const traffic = t.formattedTraffic as string;
      const articles = t.articles as Record<string, string>[] ?? [];
      const first = articles[0] ?? {};
      return {
        id: `gt-${i}-${Date.now()}`,
        platform: "google" as const,
        rank: i + 1,
        title: title?.query ?? "Trending Search",
        description: first.snippet ?? first.title ?? "",
        url: first.url ?? `https://google.com/search?q=${encodeURIComponent(title?.query ?? "")}`,
        thumbnailUrl: first.picture,
        viewCount: parseInt((traffic ?? "0").replace(/[^0-9]/g, ""), 10) * 1000,
        author: first.source,
        publishedAt: new Date().toISOString(),
        tags: [],
      } satisfies TrendItem;
    });
  } catch (err) {
    console.warn("[Google Trends] Fetch failed, using mock:", (err as Error).message);
    return getMockGoogleTrends();
  }
}

function getMockGoogleTrends(): TrendItem[] {
  return [
    {
      id: "gt-mock-1", platform: "google", rank: 1,
      title: "Resident Evil 2026 cast",
      description: "Search interest spiked after Sony's trailer drop — 5M+ searches in 24 hours.",
      url: "https://google.com/search?q=resident+evil+2026+cast",
      viewCount: 5000000, author: "Google Trends",
      publishedAt: new Date().toISOString(), tags: ["movies", "ResidentEvil"],
    },
    {
      id: "gt-mock-2", platform: "google", rank: 2,
      title: "Digital Circus Netflix release date",
      description: "Fans scrambling to confirm the June 19 premiere date after the trailer dropped.",
      url: "https://google.com/search?q=digital+circus+netflix+release+date",
      viewCount: 3800000, author: "Google Trends",
      publishedAt: new Date().toISOString(), tags: ["animation", "Netflix"],
    },
    {
      id: "gt-mock-3", platform: "google", rank: 3,
      title: "ILLIT It's Me lyrics",
      description: "Fans searching for translated lyrics within hours of the MV dropping.",
      url: "https://google.com/search?q=ILLIT+it's+me+lyrics",
      viewCount: 2100000, author: "Google Trends",
      publishedAt: new Date().toISOString(), tags: ["kpop", "ILLIT", "music"],
    },
    {
      id: "gt-mock-4", platform: "google", rank: 4,
      title: "OpenAI GPT-5 release date",
      description: "Speculation about the next major model release continues to trend globally.",
      url: "https://google.com/search?q=openai+gpt-5+release+date",
      viewCount: 1900000, author: "Google Trends",
      publishedAt: new Date().toISOString(), tags: ["AI", "OpenAI", "tech"],
    },
    {
      id: "gt-mock-5", platform: "google", rank: 5,
      title: "House of Dragon season 3 premiere date",
      description: "HBO's teaser didn't reveal the date — driving search traffic through the roof.",
      url: "https://google.com/search?q=house+of+dragon+season+3+premiere+date",
      viewCount: 1600000, author: "Google Trends",
      publishedAt: new Date().toISOString(), tags: ["HBO", "HouseOfDragon"],
    },
  ];
}
