export type Platform =
  | "youtube"
  | "tiktok"
  | "reddit"
  | "instagram"
  | "twitter"
  | "google";

export interface TrendItem {
  id: string;
  platform: Platform;
  rank: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  engagementRate?: number;
  author?: string;
  authorAvatar?: string;
  duration?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
  // AI-generated
  summary?: string;
  pros?: string[];
  cons?: string[];
  sentiment?: "positive" | "mixed" | "controversial";
  keyInsight?: string;
  hashtags?: string[];
  // Extra
  metadata?: Record<string, unknown>;
}

export interface DailyDigest {
  date: string; // YYYY-MM-DD
  generatedAt: string;
  platforms: {
    youtube: TrendItem[];
    tiktok: TrendItem[];
    reddit: TrendItem[];
    instagram: TrendItem[];
    twitter: TrendItem[];
    google: TrendItem[];
  };
  topStory: TrendItem;
  editorNote: string; // AI-generated daily summary
}

export interface PlatformConfig {
  id: Platform;
  label: string;
  color: string;
  bgGradient: string;
  icon: string;
  accentHex: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  youtube: {
    id: "youtube",
    label: "YouTube",
    color: "text-red-400",
    bgGradient: "from-red-950/40 to-red-900/10",
    icon: "▶",
    accentHex: "#FF4444",
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    color: "text-cyan-400",
    bgGradient: "from-cyan-950/40 to-cyan-900/10",
    icon: "♪",
    accentHex: "#00F2EA",
  },
  reddit: {
    id: "reddit",
    label: "Reddit",
    color: "text-orange-400",
    bgGradient: "from-orange-950/40 to-orange-900/10",
    icon: "↑",
    accentHex: "#FF6314",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    color: "text-pink-400",
    bgGradient: "from-pink-950/40 to-purple-900/10",
    icon: "◈",
    accentHex: "#E1306C",
  },
  twitter: {
    id: "twitter",
    label: "X / Twitter",
    color: "text-slate-300",
    bgGradient: "from-slate-800/40 to-slate-900/10",
    icon: "𝕏",
    accentHex: "#FFFFFF",
  },
  google: {
    id: "google",
    label: "Google Trends",
    color: "text-blue-400",
    bgGradient: "from-blue-950/40 to-blue-900/10",
    icon: "⟳",
    accentHex: "#4285F4",
  },
};
