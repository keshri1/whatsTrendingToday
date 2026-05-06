import axios from "axios";
import type { TrendItem } from "@/types";

// Instagram Graph API: hashtag search for trending content
// Requires: Instagram Business account + Facebook App
// Docs: developers.facebook.com/docs/instagram-api/guides/hashtag-search
export async function fetchInstagramTrending(count = 5): Promise<TrendItem[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) {
    console.warn("[Instagram] Missing credentials — returning mock data");
    return getMockInstagram();
  }

  const hashtags = ["viral", "trending", "reels", "explore", "fyp"];

  const results: TrendItem[] = [];
  for (let i = 0; i < Math.min(hashtags.length, count); i++) {
    try {
      // Get hashtag ID
      const idRes = await axios.get(
        `https://graph.facebook.com/v19.0/ig_hashtag_search`,
        {
          params: { user_id: userId, q: hashtags[i], access_token: token },
          timeout: 6000,
        }
      );
      const hashtagId = idRes.data?.data?.[0]?.id;
      if (!hashtagId) continue;

      // Get top media for this hashtag
      const mediaRes = await axios.get(
        `https://graph.facebook.com/v19.0/${hashtagId}/top_media`,
        {
          params: {
            user_id: userId,
            access_token: token,
            fields: "id,caption,media_type,like_count,comments_count,timestamp,thumbnail_url,permalink",
          },
          timeout: 6000,
        }
      );

      const items = mediaRes.data?.data as Record<string, unknown>[] ?? [];
      const top = items[0];
      if (!top) continue;

      results.push({
        id: `ig-${top.id as string}`,
        platform: "instagram" as const,
        rank: i + 1,
        title: `#${hashtags[i]} — Trending Reel`,
        description: ((top.caption as string) ?? "").slice(0, 300),
        url: top.permalink as string ?? `https://instagram.com/explore/tags/${hashtags[i]}/`,
        thumbnailUrl: top.thumbnail_url as string | undefined,
        likeCount: top.like_count as number ?? 0,
        commentCount: top.comments_count as number ?? 0,
        author: `#${hashtags[i]}`,
        publishedAt: top.timestamp as string,
        tags: [hashtags[i]],
      } satisfies TrendItem);
    } catch {
      continue;
    }
  }

  return results.length > 0 ? results : getMockInstagram();
}

function getMockInstagram(): TrendItem[] {
  return [
    {
      id: "ig-mock-1", platform: "instagram", rank: 1,
      title: "#GlowUp Transformation Reel",
      description: "6-month fitness transformation reel hitting 2.1M plays in 3 days. The \"before/after + process\" format continues to dominate Reels engagement.",
      url: "https://instagram.com/explore/tags/glowup/",
      thumbnailUrl: "https://placehold.co/400x500/1a0a2e/E1306C?text=Reel+1",
      viewCount: 2100000, likeCount: 310000, commentCount: 8900,
      engagementRate: 15.2, author: "#GlowUp",
      publishedAt: new Date().toISOString(), tags: ["glowup", "fitness", "transformation"],
    },
    {
      id: "ig-mock-2", platform: "instagram", rank: 2,
      title: "#AIArt Week Challenge",
      description: "\"Turn your selfie into Renaissance art\" challenge. 4.8M posts in 48 hours, fuelled by a new free AI tool that requires no signup.",
      url: "https://instagram.com/explore/tags/aiart/",
      thumbnailUrl: "https://placehold.co/400x500/1a0a2e/E1306C?text=Reel+2",
      viewCount: 4800000, likeCount: 890000, commentCount: 34000,
      engagementRate: 19.2, author: "#AIArt",
      publishedAt: new Date().toISOString(), tags: ["aiart", "challenge", "viral"],
    },
    {
      id: "ig-mock-3", platform: "instagram", rank: 3,
      title: "#SilentWalking Trend",
      description: "The \"silent walking\" wellness trend — walking 20 minutes with no phone, no music. 9M posts globally. Gen Z's reaction to digital burnout is going analogue.",
      url: "https://instagram.com/explore/tags/silentwalking/",
      thumbnailUrl: "https://placehold.co/400x500/1a0a2e/E1306C?text=Reel+3",
      viewCount: 9000000, likeCount: 1200000, commentCount: 45000,
      engagementRate: 13.8, author: "#SilentWalking",
      publishedAt: new Date().toISOString(), tags: ["wellness", "mindfulness", "viral"],
    },
    {
      id: "ig-mock-4", platform: "instagram", rank: 4,
      title: "#BookTok Meets Reels",
      description: "BookTok crosses to Instagram with 30-second \"book aesthetic\" reels. Cozy reading corners + ambient music driving massive saves (the metric Instagram's algorithm now weights most).",
      url: "https://instagram.com/explore/tags/booktok/",
      thumbnailUrl: "https://placehold.co/400x500/1a0a2e/E1306C?text=Reel+4",
      viewCount: 6200000, likeCount: 780000, commentCount: 22000,
      engagementRate: 12.9, author: "#BookTok",
      publishedAt: new Date().toISOString(), tags: ["books", "aesthetic", "cozy"],
    },
    {
      id: "ig-mock-5", platform: "instagram", rank: 5,
      title: "#HouseOfDragon Fan Edits",
      description: "Fan-made trailer edits and reaction reels flooding Explore after the S3 teaser. Dragon CGI breakdowns are particularly viral among VFX communities.",
      url: "https://instagram.com/explore/tags/houseofthedragon/",
      thumbnailUrl: "https://placehold.co/400x500/1a0a2e/E1306C?text=Reel+5",
      viewCount: 3400000, likeCount: 420000, commentCount: 18000,
      engagementRate: 12.9, author: "#HouseOfDragon",
      publishedAt: new Date().toISOString(), tags: ["HouseOfDragon", "fanart", "HBO"],
    },
  ];
}
