import { MetadataRoute } from "next";
import { listCachedDates } from "@/lib/cache";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://whatstrendingtoday.com";
  const dates = await listCachedDates();

  const datePages = dates.map((date) => ({
    url: `${base}/?date=${date}`,
    lastModified: new Date(date),
    changeFrequency: "daily" as const,
    priority: date === new Date().toISOString().split("T")[0] ? 1.0 : 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...datePages,
  ];
}
