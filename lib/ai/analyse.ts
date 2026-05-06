import Anthropic from "@anthropic-ai/sdk";
import type { TrendItem, DailyDigest } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyseItems(items: TrendItem[]): Promise<TrendItem[]> {
  if (!process.env.ANTHROPIC_API_KEY) return items;

  const batch = items.slice(0, 5); // analyse top 5 per platform
  const results = await Promise.all(batch.map(analyseItem));
  return [...results, ...items.slice(5)];
}

async function analyseItem(item: TrendItem): Promise<TrendItem> {
  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Analyse this trending ${item.platform} item briefly.
Title: ${item.title}
Platform: ${item.platform}
Views/Score: ${item.viewCount?.toLocaleString() ?? "unknown"}
Description: ${item.description}

Return JSON only:
{
  "summary": "2 sentence neutral summary",
  "pros": ["2-3 specific strengths"],
  "cons": ["1-2 honest criticisms"],
  "sentiment": "positive|mixed|controversial",
  "keyInsight": "one punchy sentence under 15 words"
}`,
      }],
    });

    const raw = res.content[0].type === "text" ? res.content[0].text : "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return { ...item, ...parsed };
  } catch {
    return item;
  }
}

export async function generateEditorNote(digest: Partial<DailyDigest>): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "Today's trending content spans entertainment, gaming, K-pop, and technology — with gaming and streaming dominating cross-platform conversation for the second week running.";
  }

  const topItems = [
    ...(digest.platforms?.youtube?.slice(0, 2) ?? []),
    ...(digest.platforms?.tiktok?.slice(0, 1) ?? []),
    ...(digest.platforms?.reddit?.slice(0, 1) ?? []),
  ].map(i => `${i.platform}: "${i.title}"`).join("\n");

  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [{
      role: "user",
      content: `Write a 2-sentence editor's note for today's trending digest. Be insightful about what these trends collectively say about culture/society right now. Trending items:\n${topItems}\n\nReturn only the 2-sentence note, no labels.`,
    }],
  });

  return res.content[0].type === "text" ? res.content[0].text.trim() : "";
}
