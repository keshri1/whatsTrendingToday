import axios from "axios";
import type { TrendItem } from "@/types";

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "—";
  const h = match[1] ? `${match[1]}h ` : "";
  const m = match[2] ? `${match[2]}m ` : "";
  const s = match[3] ? `${match[3]}s` : "";
  return `${h}${m}${s}`.trim();
}

export async function fetchYouTubeTrending(count = 5): Promise<TrendItem[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.warn("[YouTube] No API key — returning mock data");
    return getMockYouTube();
  }

  const res = await axios.get(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      params: {
        part: "snippet,statistics,contentDetails",
        chart: "mostPopular",
        regionCode: "US",
        maxResults: Math.max(count, 10),
        key,
      },
      timeout: 8000,
    }
  );

  const items = (res.data.items as Record<string, unknown>[]) ?? [];
  return items
    .map((item, i) => {
      const s = item.snippet as Record<string, unknown>;
      const st = item.statistics as Record<string, string>;
      const cd = item.contentDetails as Record<string, string>;
      const th = (s.thumbnails as Record<string, { url: string }>) ?? {};
      const views = parseInt(st.viewCount ?? "0", 10);
      const likes = parseInt(st.likeCount ?? "0", 10);
      const comments = parseInt(st.commentCount ?? "0", 10);
      return {
        id: `yt-${item.id}`,
        platform: "youtube" as const,
        rank: i + 1,
        title: s.title as string,
        description: ((s.description as string) ?? "").slice(0, 300),
        url: `https://youtube.com/watch?v=${item.id as string}`,
        thumbnailUrl: th.maxres?.url ?? th.high?.url ?? th.default?.url,
        viewCount: views,
        likeCount: likes,
        commentCount: comments,
        engagementRate: views > 0 ? ((likes + comments) / views) * 100 : 0,
        author: s.channelTitle as string,
        duration: parseDuration(cd.duration ?? ""),
        publishedAt: s.publishedAt as string,
        category: s.categoryId as string,
        tags: (s.tags as string[] | undefined)?.slice(0, 5) ?? [],
      } satisfies TrendItem;
    })
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, count);
}

function getMockYouTube(): TrendItem[] {
  return [
    {
      id: "yt-mock-1",
      platform: "youtube",
      rank: 1,
      title: "Digital Circus Ep 9 Finale [TRAILER]",
      description: "The final episode of The Amazing Digital Circus is here. June 19 on YouTube and Netflix.",
      url: "https://youtube.com/watch?v=AjFk1cY265I",
      thumbnailUrl: "https://i.ytimg.com/vi/AjFk1cY265I/maxresdefault.jpg",
      viewCount: 27000000,
      likeCount: 1600000,
      commentCount: 113000,
      engagementRate: 6.3,
      author: "GLITCH",
      duration: "1m 10s",
      publishedAt: new Date().toISOString(),
      tags: ["animation", "digital circus", "glitch"],
    },
    {
      id: "yt-mock-2",
      platform: "youtube",
      rank: 2,
      title: "1 Day vs 50,000 Day Build Challenge",
      description: "MrBeast visits the most impressive Hardcore Minecraft world ever built.",
      url: "https://youtube.com/watch?v=Vo6QTBMdUfU",
      thumbnailUrl: "https://i.ytimg.com/vi/Vo6QTBMdUfU/maxresdefault.jpg",
      viewCount: 24400000,
      likeCount: 412000,
      commentCount: 13200,
      engagementRate: 1.7,
      author: "MrBeast Gaming",
      duration: "19m 46s",
      publishedAt: new Date().toISOString(),
      tags: ["minecraft", "mrbeast", "gaming"],
    },
    {
      id: "yt-mock-3",
      platform: "youtube",
      rank: 3,
      title: "ILLIT (아일릿) 'It's Me' Official MV",
      description: "ILLIT's brand new single from HYBE LABELS. Out now on all platforms.",
      url: "https://youtube.com/watch?v=bMhDJ0S0OBA",
      thumbnailUrl: "https://i.ytimg.com/vi/bMhDJ0S0OBA/maxresdefault.jpg",
      viewCount: 8700000,
      likeCount: 303000,
      commentCount: 19700,
      engagementRate: 3.7,
      author: "HYBE LABELS",
      duration: "2m 27s",
      publishedAt: new Date().toISOString(),
      tags: ["kpop", "ILLIT", "HYBE"],
    },
    {
      id: "yt-mock-4",
      platform: "youtube",
      rank: 4,
      title: "House of the Dragon Season 3 | Official Teaser | HBO",
      description: "The Dance of the Dragons continues. House of the Dragon Season 3 coming soon to HBO Max.",
      url: "https://youtube.com/watch?v=5X1dMFuHZhc",
      thumbnailUrl: "https://i.ytimg.com/vi/5X1dMFuHZhc/maxresdefault.jpg",
      viewCount: 3200000,
      likeCount: 95300,
      commentCount: 4100,
      engagementRate: 3.1,
      author: "HBO",
      duration: "1m 55s",
      publishedAt: new Date().toISOString(),
      tags: ["HBO", "HouseOfDragon", "GoT"],
    },
    {
      id: "yt-mock-5",
      platform: "youtube",
      rank: 5,
      title: "RESIDENT EVIL – Official Teaser Trailer (4K)",
      description: "Evil has evolved. The new Resident Evil film arrives 2026. Only in cinemas.",
      url: "https://youtube.com/watch?v=SJPu1spHqfk",
      thumbnailUrl: "https://i.ytimg.com/vi/SJPu1spHqfk/maxresdefault.jpg",
      viewCount: 3100000,
      likeCount: 149800,
      commentCount: 17200,
      engagementRate: 5.4,
      author: "Sony Pictures Entertainment",
      duration: "1m 54s",
      publishedAt: new Date().toISOString(),
      tags: ["ResidentEvil", "Sony", "horror"],
    },
  ];
}
