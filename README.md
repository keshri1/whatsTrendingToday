# 🌐 WhatsTrendingToday

> Real-time trending content from YouTube, TikTok, Instagram Reels, Reddit, X/Twitter and Google Trends — all in one place. Browse by day. AI-summarised.

---

## Features

| | Feature |
|---|---|
| 📺 | Top 5 trending YouTube videos with views, engagement, pros/cons |
| 🎵 | Top 5 TikTok viral videos |
| 📱 | Instagram trending hashtag reels |
| 🔥 | Reddit r/popular hottest posts |
| 𝕏 | X/Twitter worldwide trending topics |
| 🔍 | Google Trends daily top searches |
| 🤖 | Claude AI summaries, pros/cons, key insight per item |
| 📅 | Day-by-day navigation (7-day history) |
| ♿ | WCAG AA accessible (semantic HTML, ARIA, keyboard nav) |
| 🚀 | ISR (Incremental Static Regeneration) — instant page loads |
| 🔎 | Full SEO: sitemap, robots.txt, structured data, OpenGraph |
| 📱 | Fully responsive — mobile, tablet, desktop |
| ⚡ | Skeleton loaders — zero layout shift |

---

## Stack

- **Next.js 14** — App Router, ISR, Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — custom dark design system
- **Claude AI** — summaries, pros/cons, editor notes
- **Vercel Cron** — hourly data refresh

---

## Quick Start

```bash
git clone https://github.com/yourname/whatstrendingtoday
cd whatstrendingtoday
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Open http://localhost:3000

---

## API Keys Setup

### Required
| Key | Where to get | Free tier |
|---|---|---|
| `YOUTUBE_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) → YouTube Data API v3 | ✅ 10K units/day |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Pay per use ~$0.01/run |

### Optional (mock data used if missing)
| Key | Where to get |
|---|---|
| `TIKTOK_ACCESS_TOKEN` | [developers.tiktok.com](https://developers.tiktok.com) → Research API |
| `INSTAGRAM_ACCESS_TOKEN` | [developers.facebook.com](https://developers.facebook.com) → Graph API |
| `INSTAGRAM_USER_ID` | Same as above |
| `TWITTER_BEARER_TOKEN` | [developer.x.com](https://developer.x.com) → Bearer Token |

> **Note:** Reddit and Google Trends work without any API key.
> Without optional keys, the app uses realistic mock data for those platforms.

---

## Deploy to Vercel

```bash
vercel link
vercel deploy --prod
```

Add env vars in Vercel dashboard → Project → Settings → Environment Variables.

The `vercel.json` cron job refreshes data every hour automatically.

---

## SEO Strategy

The site is built to rank for:
- "what's trending today"
- "trending on YouTube today"
- "viral TikTok videos today"
- "trending on Reddit"
- "what's viral right now"
- "most viewed YouTube videos"

Implemented via:
- Keyword-rich `<title>` and `<meta description>` per page (including date)
- `application/ld+json` structured data (WebSite schema with SearchAction)
- Dynamic `sitemap.xml` including one URL per cached date
- `robots.txt` allowing full crawl
- Hourly ISR — fresh content = frequent Googlebot visits
- Semantic HTML with proper heading hierarchy
- OpenGraph + Twitter cards for social sharing

---

## Accessibility

- All interactive elements keyboard navigable
- ARIA roles, labels, and `aria-current` on date navigation
- `aria-busy` during loading, `aria-live` for dynamic updates
- Skip-to-content link
- All images have meaningful `alt` text
- Colour contrast AA compliant
- Reduced motion respected via CSS

---

## Architecture

```
Vercel Cron (hourly)
       │
       ▼
/api/cron → /api/trends?refresh=true
                │
                ├── YouTube Data API v3
                ├── TikTok Research API
                ├── Reddit public JSON
                ├── Instagram Graph API
                ├── Twitter/X Bearer v2
                └── Google Trends npm
                │
                ▼
          Claude AI Analysis
          (summaries, pros, cons)
                │
                ▼
         .cache/YYYY-MM-DD.json
                │
                ▼
    Next.js ISR (revalidate: 3600)
    → instant page loads from cache
```

---

## Project Structure

```
whatstrendingtoday/
├── app/
│   ├── layout.tsx          # Root layout + full SEO metadata
│   ├── page.tsx            # Main page (ISR, date-aware)
│   ├── globals.css         # Dark design system
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── robots.ts           # robots.txt
│   └── api/
│       ├── trends/route.ts          # Main trends API
│       ├── trends/[date]/route.ts   # Date-specific API
│       └── cron/route.ts            # Vercel Cron endpoint
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Sticky nav, skip link, live badge
│   │   ├── Hero.tsx         # Aurora background hero
│   │   ├── DateNav.tsx      # 7-day date navigation
│   │   ├── PlatformTabs.tsx # Platform filter tabs
│   │   └── Footer.tsx
│   ├── platform/
│   │   ├── TrendGrid.tsx    # Server component — fetches & lays out
│   │   ├── TrendCard.tsx    # Individual trend card
│   │   ├── TopStoryHero.tsx # Featured top story banner
│   │   ├── EditorNote.tsx   # AI editor summary
│   │   └── ProsConsPanel.tsx
│   └── ui/
│       └── TrendGridSkeleton.tsx  # Skeleton loader
├── lib/
│   ├── fetchers/            # One file per platform
│   ├── ai/analyse.ts        # Claude analysis
│   ├── cache.ts             # File-based JSON cache
│   └── utils.ts
└── types/index.ts           # All shared types + PLATFORM_CONFIG
```
