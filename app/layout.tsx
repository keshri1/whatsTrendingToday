import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://whatstrendingtoday.com";
const SITE_NAME = "What's Trending Today";
const DESCRIPTION =
  "Real-time trending content from YouTube, TikTok, Instagram, Reddit, X/Twitter and Google Trends — all in one place. Updated hourly. Browse by day.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Top Trending Videos, Posts & Searches Worldwide`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "what's trending today",
    "trending videos",
    "trending on YouTube",
    "viral TikTok",
    "trending on Reddit",
    "Instagram trending reels",
    "Google trending searches",
    "what's viral today",
    "top trending worldwide",
    "trending content 2025",
    "most viewed YouTube videos",
    "viral videos today",
    "trending news today",
    "popular videos right now",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Top Trending Worldwide`,
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Top Trending Worldwide`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@whatstrendingtoday",
  },
  alternates: { canonical: SITE_URL },
  verification: {
    google: process.env.GOOGLE_VERIFICATION ?? "",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#03040A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: DESCRIPTION,
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?date={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
