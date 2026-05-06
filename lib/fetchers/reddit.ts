import axios from "axios";
import type { TrendItem } from "@/types";

export async function fetchRedditTrending(count = 5): Promise<TrendItem[]> {
  try {
    const res = await axios.get(
      "https://www.reddit.com/r/popular/hot.json",
      {
        params: { limit: count },
        headers: { "User-Agent": "whatstrendingtoday/1.0" },
        timeout: 8000,
      }
    );

    const posts = res.data?.data?.children as Record<string, unknown>[];
    if (!posts?.length) return getMockReddit();

    return posts.slice(0, count).map((child, i) => {
      const p = child.data as Record<string, unknown>;
      const ups = p.ups as number ?? 0;
      const comments = p.num_comments as number ?? 0;
      const score = p.score as number ?? 0;
      const preview = p.preview as Record<string, unknown> | undefined;
      const images = preview?.images as Record<string, unknown>[] | undefined;
      const thumbnail = images?.[0]?.source as { url: string } | undefined;

      return {
        id: `rd-${p.id as string}`,
        platform: "reddit" as const,
        rank: i + 1,
        title: p.title as string,
        description: (p.selftext as string ?? "").slice(0, 300),
        url: `https://reddit.com${p.permalink as string}`,
        thumbnailUrl: thumbnail?.url?.replace(/&amp;/g, "&"),
        viewCount: score,
        likeCount: ups,
        commentCount: comments,
        engagementRate: score > 0 ? (comments / score) * 100 : 0,
        author: `r/${p.subreddit as string}`,
        publishedAt: new Date((p.created_utc as number) * 1000).toISOString(),
        category: p.subreddit as string,
        tags: [],
      } satisfies TrendItem;
    });
  } catch (err) {
    console.warn("[Reddit] Fetch failed, using mock:", (err as Error).message);
    return getMockReddit();
  }
}

function getMockReddit(): TrendItem[] {
  return [
    {
      id: "rd-mock-1", platform: "reddit", rank: 1,
      title: "James Webb captures sharpest image of a stellar nursery yet",
      description: "NASA's JWST reveals never-before-seen detail in the Carina Nebula, capturing protostars that were previously invisible.",
      url: "https://reddit.com/r/space/comments/mock1",
      viewCount: 142000, likeCount: 138000, commentCount: 3200,
      engagementRate: 2.3, author: "r/space",
      publishedAt: new Date().toISOString(), tags: ["NASA", "JWST", "space"],
    },
    {
      id: "rd-mock-2", platform: "reddit", rank: 2,
      title: "This 95-year-old grandmother just learned to play piano and performed at her town hall",
      description: "After losing her husband of 60 years, she decided to finally pursue her lifelong dream.",
      url: "https://reddit.com/r/wholesome/comments/mock2",
      viewCount: 98000, likeCount: 97000, commentCount: 1450,
      engagementRate: 1.5, author: "r/wholesome",
      publishedAt: new Date().toISOString(), tags: ["wholesome", "piano", "heartwarming"],
    },
    {
      id: "rd-mock-3", platform: "reddit", rank: 3,
      title: "OpenAI announces GPT-5 with 100x the context window of GPT-4",
      description: "The new model can process entire codebases and books in a single prompt, fundamentally changing how developers work.",
      url: "https://reddit.com/r/technology/comments/mock3",
      viewCount: 87000, likeCount: 82000, commentCount: 5600,
      engagementRate: 6.4, author: "r/technology",
      publishedAt: new Date().toISOString(), tags: ["OpenAI", "AI", "GPT5"],
    },
    {
      id: "rd-mock-4", platform: "reddit", rank: 4,
      title: "City replaces parking lot with urban forest — crime drops 40%, property values rise 22%",
      description: "A decade-long study confirms what urban planners suspected: green space dramatically improves city health metrics.",
      url: "https://reddit.com/r/urbanplanning/comments/mock4",
      viewCount: 76000, likeCount: 74000, commentCount: 2100,
      engagementRate: 2.8, author: "r/urbanplanning",
      publishedAt: new Date().toISOString(), tags: ["cities", "environment", "urban"],
    },
    {
      id: "rd-mock-5", platform: "reddit", rank: 5,
      title: "Scientists reverse aging in mice by 50% using a single injection",
      description: "Researchers at Harvard publish breakthrough results — human trials expected to begin within 18 months.",
      url: "https://reddit.com/r/science/comments/mock5",
      viewCount: 65000, likeCount: 63000, commentCount: 4200,
      engagementRate: 6.5, author: "r/science",
      publishedAt: new Date().toISOString(), tags: ["science", "aging", "medicine"],
    },
  ];
}
