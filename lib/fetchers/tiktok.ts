import axios from "axios";
import type { TrendItem } from "@/types";

export async function fetchTikTokTrending(count = 5): Promise<TrendItem[]> {
  // TikTok Research API requires an approved developer account
  // Register at: developers.tiktok.com
  // For now, falls back to curated mock data representative of real trends
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) {
    console.warn("[TikTok] No access token — returning mock data");
    return getMockTikTok();
  }

  try {
    const res = await axios.post(
      "https://open.tiktokapis.com/v2/research/video/query/",
      {
        query: { and: [{ operation: "IN", field_name: "region_code", field_values: ["US"] }] },
        max_count: count,
        cursor: 0,
        fields: "id,title,like_count,comment_count,share_count,view_count,create_time,username,cover_image_url",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    const videos = res.data?.data?.videos as Record<string, unknown>[] ?? [];
    return videos.slice(0, count).map((v, i) => ({
      id: `tt-${v.id as string}`,
      platform: "tiktok" as const,
      rank: i + 1,
      title: (v.title as string) || "TikTok Video",
      description: v.title as string,
      url: `https://tiktok.com/@${v.username as string}/video/${v.id as string}`,
      thumbnailUrl: v.cover_image_url as string | undefined,
      viewCount: v.view_count as number ?? 0,
      likeCount: v.like_count as number ?? 0,
      commentCount: v.comment_count as number ?? 0,
      shareCount: v.share_count as number ?? 0,
      author: `@${v.username as string}`,
      publishedAt: new Date((v.create_time as number) * 1000).toISOString(),
    } satisfies TrendItem));
  } catch (err) {
    console.warn("[TikTok] Fetch failed, using mock:", (err as Error).message);
    return getMockTikTok();
  }
}

function getMockTikTok(): TrendItem[] {
  return [
    {
      id: "tt-mock-1", platform: "tiktok", rank: 1,
      title: "POV: You ask AI to explain quantum computing in 60 seconds",
      description: "The most mind-bending 60 seconds on the internet right now.",
      url: "https://tiktok.com/@scienceguy/video/tt1",
      thumbnailUrl: "https://placehold.co/400x700/0d1117/00F2EA?text=TikTok+1",
      viewCount: 48200000, likeCount: 4100000, commentCount: 87000,
      shareCount: 1200000, engagementRate: 11.1,
      author: "@scienceguy", duration: "0m 58s",
      publishedAt: new Date().toISOString(), tags: ["science", "AI", "quantum"],
    },
    {
      id: "tt-mock-2", platform: "tiktok", rank: 2,
      title: "Cooking the world's most expensive omelette ($1,200) 🍳",
      description: "White truffle, Wagyu beef, and gold leaf. Is it worth it?",
      url: "https://tiktok.com/@chefmax/video/tt2",
      thumbnailUrl: "https://placehold.co/400x700/0d1117/00F2EA?text=TikTok+2",
      viewCount: 31000000, likeCount: 2900000, commentCount: 145000,
      shareCount: 890000, engagementRate: 10.1,
      author: "@chefmax", duration: "2m 14s",
      publishedAt: new Date().toISOString(), tags: ["food", "cooking", "luxury"],
    },
    {
      id: "tt-mock-3", platform: "tiktok", rank: 3,
      title: "This dog learned to type. No, seriously.",
      description: "Koda the Golden Retriever has 14 million followers and now sends emails.",
      url: "https://tiktok.com/@kodadog/video/tt3",
      thumbnailUrl: "https://placehold.co/400x700/0d1117/00F2EA?text=TikTok+3",
      viewCount: 28000000, likeCount: 5600000, commentCount: 210000,
      shareCount: 1400000, engagementRate: 21.5,
      author: "@kodadog", duration: "0m 32s",
      publishedAt: new Date().toISOString(), tags: ["dog", "viral", "cute"],
    },
    {
      id: "tt-mock-4", platform: "tiktok", rank: 4,
      title: "Duet this with your reaction to 2016 you 👁️",
      description: "The viral duet chain that has 800M stitches. Where were you in 2016?",
      url: "https://tiktok.com/@nostalgiavibes/video/tt4",
      thumbnailUrl: "https://placehold.co/400x700/0d1117/00F2EA?text=TikTok+4",
      viewCount: 19000000, likeCount: 1700000, commentCount: 390000,
      shareCount: 2100000, engagementRate: 22.0,
      author: "@nostalgiavibes", duration: "0m 15s",
      publishedAt: new Date().toISOString(), tags: ["nostalgia", "duet", "viral"],
    },
    {
      id: "tt-mock-5", platform: "tiktok", rank: 5,
      title: "I quit my $300k job to move to a farm. One year later.",
      description: "Burnout, bees, goats, and absolutely zero regrets. Full update.",
      url: "https://tiktok.com/@farmlife/video/tt5",
      thumbnailUrl: "https://placehold.co/400x700/0d1117/00F2EA?text=TikTok+5",
      viewCount: 15000000, likeCount: 2300000, commentCount: 187000,
      shareCount: 780000, engagementRate: 20.4,
      author: "@farmlife_reset", duration: "3m 02s",
      publishedAt: new Date().toISOString(), tags: ["lifestyle", "farm", "burnout"],
    },
  ];
}
