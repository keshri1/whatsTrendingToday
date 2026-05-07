import axios from "axios";
import type { TrendItem } from "@/types";

export async function fetchTwitterTrending(count = 5): Promise<TrendItem[]> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) {
    console.warn("[Twitter] No bearer token — returning mock data");
    return getMockTwitter();
  }

  try {
    // WOEID 1 = worldwide
    const res = await axios.get(
      "https://api.twitter.com/1.1/trends/place.json?id=1",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000,
      }
    );

    const trends = res.data?.[0]?.trends as Record<string, unknown>[] ?? [];
    return trends.slice(0, count).map((t, i) => ({
      id: `tw-${i}-${Date.now()}`,
      platform: "twitter" as const,
      rank: i + 1,
      title: t.name as string,
      description: t.tweet_volume
        ? `${(t.tweet_volume as number).toLocaleString()} tweets`
        : "Trending worldwide",
      url: t.url as string ?? `https://x.com/search?q=${encodeURIComponent(t.name as string)}`,
      viewCount: t.tweet_volume as number ?? 0,
      author: "X / Twitter",
      publishedAt: new Date().toISOString(),
      tags: [],
    } satisfies TrendItem));
  } catch (err) {
    console.warn("[Twitter] Fetch failed, using mock:", (err as Error).message);
    return getMockTwitter();
  }
}

function getMockTwitter(): TrendItem[] {
  return [
    {
      id: "tw-mock-1", platform: "twitter", rank: 1,
      title: "#ResidentEvil",
      description: "Sony's trailer ignites 2.4M tweets. Fans split on whether the reboot respects the source material.",
      url: "https://x.com/search?q=%23ResidentEvil",
      thumbnailUrl: "https://placehold.co/640x360/0d0d12/E7E7F0?text=%23ResidentEvil",
      viewCount: 2400000, author: "X / Twitter",
      publishedAt: new Date().toISOString(), tags: ["ResidentEvil", "Sony"],
    },
    {
      id: "tw-mock-2", platform: "twitter", rank: 2,
      title: "#DigitalCircus",
      description: "\"June 19\" trending as fans count down to the series finale. 1.8M tweets.",
      url: "https://x.com/search?q=%23DigitalCircus",
      thumbnailUrl: "https://placehold.co/640x360/0d0d12/E7E7F0?text=%23DigitalCircus",
      viewCount: 1800000, author: "X / Twitter",
      publishedAt: new Date().toISOString(), tags: ["animation", "DigitalCircus"],
    },
    {
      id: "tw-mock-3", platform: "twitter", rank: 3,
      title: "#GPT5",
      description: "Rumours of an imminent GPT-5 release are sending AI Twitter into overdrive. 1.2M tweets.",
      url: "https://x.com/search?q=%23GPT5",
      thumbnailUrl: "https://placehold.co/640x360/0d0d12/E7E7F0?text=%23GPT5",
      viewCount: 1200000, author: "X / Twitter",
      publishedAt: new Date().toISOString(), tags: ["AI", "OpenAI", "GPT5"],
    },
    {
      id: "tw-mock-4", platform: "twitter", rank: 4,
      title: "#MrBeast",
      description: "Gaming challenge video sparks debate: is 50,000 Minecraft days the most productive use of human time? 980K tweets.",
      url: "https://x.com/search?q=%23MrBeast",
      thumbnailUrl: "https://placehold.co/640x360/0d0d12/E7E7F0?text=%23MrBeast",
      viewCount: 980000, author: "X / Twitter",
      publishedAt: new Date().toISOString(), tags: ["MrBeast", "gaming"],
    },
    {
      id: "tw-mock-5", platform: "twitter", rank: 5,
      title: "#HOTDS3",
      description: "House of the Dragon fans theorising about Season 3 plot based on 3 seconds of new footage. 870K tweets.",
      url: "https://x.com/search?q=%23HOTDS3",
      thumbnailUrl: "https://placehold.co/640x360/0d0d12/E7E7F0?text=%23HOTDS3",
      viewCount: 870000, author: "X / Twitter",
      publishedAt: new Date().toISOString(), tags: ["HouseOfDragon", "HBO"],
    },
  ];
}
