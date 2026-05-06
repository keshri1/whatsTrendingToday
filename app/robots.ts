import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/.cache/"],
      },
    ],
    sitemap: "https://whatstrendingtoday.com/sitemap.xml",
    host: "https://whatstrendingtoday.com",
  };
}
