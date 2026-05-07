"use client";

import { useState } from "react";
import Image from "next/image";
import type { TrendItem } from "@/types";
import { PLATFORM_CONFIG } from "@/types";

// Unique SVG patterns per platform for when no real thumbnail exists
const PLATFORM_PATTERNS: Record<string, (accent: string, title: string, icon: string) => string> = {
  twitter: (accent, title, icon) => `
    <svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0e18"/>
          <stop offset="100%" stop-color="#1a1a2e"/>
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <rect width="640" height="360" fill="url(#g)"/>
      <!-- glow blobs -->
      <circle cx="120" cy="80" r="90" fill="${accent}" opacity="0.08" filter="url(#blur)"/>
      <circle cx="520" cy="280" r="100" fill="${accent}" opacity="0.06" filter="url(#blur)"/>
      <!-- grid lines -->
      ${Array.from({length:7},(_,i)=>`<line x1="${i*107}" y1="0" x2="${i*107}" y2="360" stroke="${accent}" stroke-width="0.4" opacity="0.1"/>`).join("")}
      ${Array.from({length:5},(_,i)=>`<line x1="0" y1="${i*90}" x2="640" y2="${i*90}" stroke="${accent}" stroke-width="0.4" opacity="0.1"/>`).join("")}
      <!-- big icon -->
      <text x="320" y="185" text-anchor="middle" font-size="96" font-family="monospace" fill="${accent}" opacity="0.18">${icon}</text>
      <!-- trend label -->
      <rect x="200" y="220" width="240" height="36" rx="18" fill="${accent}" opacity="0.12"/>
      <text x="320" y="243" text-anchor="middle" font-size="13" font-family="monospace" fill="${accent}" opacity="0.9">TRENDING WORLDWIDE</text>
      <!-- title overlay (truncated) -->
      <text x="320" y="160" text-anchor="middle" font-size="22" font-weight="bold" font-family="sans-serif" fill="white" opacity="0.85">${title.length > 22 ? title.slice(0,22)+"…" : title}</text>
    </svg>`,

  instagram: (accent, title, icon) => `
    <svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a0a2e"/>
          <stop offset="50%" stop-color="#2d0a1e"/>
          <stop offset="100%" stop-color="#1a0a0a"/>
        </linearGradient>
        <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f09433"/>
          <stop offset="25%" stop-color="#e6683c"/>
          <stop offset="50%" stop-color="#dc2743"/>
          <stop offset="75%" stop-color="#cc2366"/>
          <stop offset="100%" stop-color="#bc1888"/>
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="22"/></filter>
      </defs>
      <rect width="640" height="360" fill="url(#g)"/>
      <!-- ig gradient blobs -->
      <circle cx="100" cy="60" r="110" fill="#f09433" opacity="0.07" filter="url(#blur)"/>
      <circle cx="540" cy="300" r="120" fill="#bc1888" opacity="0.07" filter="url(#blur)"/>
      <circle cx="320" cy="180" r="80" fill="#dc2743" opacity="0.05" filter="url(#blur)"/>
      <!-- diagonal lines -->
      ${Array.from({length:9},(_,i)=>`<line x1="${-100+i*100}" y1="0" x2="${i*100+260}" y2="360" stroke="white" stroke-width="0.5" opacity="0.04"/>`).join("")}
      <!-- big icon -->
      <text x="320" y="185" text-anchor="middle" font-size="88" font-family="serif" fill="url(#ig)" opacity="0.22">${icon}</text>
      <!-- gradient pill -->
      <rect x="190" y="218" width="260" height="36" rx="18" fill="url(#ig)" opacity="0.15"/>
      <text x="320" y="241" text-anchor="middle" font-size="12" font-family="monospace" fill="white" opacity="0.85">TRENDING REEL</text>
      <!-- title -->
      <text x="320" y="158" text-anchor="middle" font-size="20" font-weight="bold" font-family="sans-serif" fill="white" opacity="0.85">${title.length > 26 ? title.slice(0,26)+"…" : title}</text>
    </svg>`,

  google: (accent, title, icon) => `
    <svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#03040A"/>
          <stop offset="100%" stop-color="#0a0d1a"/>
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="20"/></filter>
      </defs>
      <rect width="640" height="360" fill="url(#g)"/>
      <circle cx="160" cy="100" r="80" fill="#4285F4" opacity="0.08" filter="url(#blur)"/>
      <circle cx="480" cy="260" r="80" fill="#34A853" opacity="0.07" filter="url(#blur)"/>
      <circle cx="100" cy="260" r="70" fill="#FBBC05" opacity="0.06" filter="url(#blur)"/>
      <circle cx="540" cy="100" r="70" fill="#EA4335" opacity="0.07" filter="url(#blur)"/>
      ${Array.from({length:7},(_,i)=>`<line x1="${i*107}" y1="0" x2="${i*107}" y2="360" stroke="${accent}" stroke-width="0.4" opacity="0.08"/>`).join("")}
      ${Array.from({length:5},(_,i)=>`<line x1="0" y1="${i*90}" x2="640" y2="${i*90}" stroke="${accent}" stroke-width="0.4" opacity="0.08"/>`).join("")}
      <text x="320" y="185" text-anchor="middle" font-size="80" font-family="monospace" fill="${accent}" opacity="0.15">${icon}</text>
      <rect x="200" y="218" width="240" height="36" rx="18" fill="${accent}" opacity="0.12"/>
      <text x="320" y="241" text-anchor="middle" font-size="12" font-family="monospace" fill="${accent}" opacity="0.9">🔍 TRENDING SEARCH</text>
      <text x="320" y="158" text-anchor="middle" font-size="20" font-weight="bold" font-family="sans-serif" fill="white" opacity="0.85">${title.length > 26 ? title.slice(0,26)+"…" : title}</text>
    </svg>`,

  reddit: (accent, title, icon) => `
    <svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0a06"/>
          <stop offset="100%" stop-color="#1a1006"/>
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="20"/></filter>
      </defs>
      <rect width="640" height="360" fill="url(#g)"/>
      <circle cx="200" cy="120" r="100" fill="${accent}" opacity="0.08" filter="url(#blur)"/>
      <circle cx="480" cy="250" r="90" fill="${accent}" opacity="0.06" filter="url(#blur)"/>
      ${Array.from({length:7},(_,i)=>`<line x1="${i*107}" y1="0" x2="${i*107}" y2="360" stroke="${accent}" stroke-width="0.4" opacity="0.08"/>`).join("")}
      ${Array.from({length:5},(_,i)=>`<line x1="0" y1="${i*90}" x2="640" y2="${i*90}" stroke="${accent}" stroke-width="0.4" opacity="0.08"/>`).join("")}
      <text x="320" y="185" text-anchor="middle" font-size="80" font-family="monospace" fill="${accent}" opacity="0.15">${icon}</text>
      <rect x="200" y="218" width="240" height="36" rx="18" fill="${accent}" opacity="0.14"/>
      <text x="320" y="241" text-anchor="middle" font-size="12" font-family="monospace" fill="white" opacity="0.9">↑ HOT ON REDDIT</text>
      <text x="320" y="158" text-anchor="middle" font-size="17" font-weight="bold" font-family="sans-serif" fill="white" opacity="0.85">${title.length > 30 ? title.slice(0,30)+"…" : title}</text>
    </svg>`,
};

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

interface Props { item: TrendItem }

export default function CardThumbnail({ item }: Props) {
  const cfg = PLATFORM_CONFIG[item.platform];
  const [imgError, setImgError] = useState(false);

  const showRealImage = item.thumbnailUrl && !imgError;
  const patternFn = PLATFORM_PATTERNS[item.platform];
  const fallbackSrc = patternFn
    ? svgToDataUri(patternFn(cfg.accentHex, item.title, cfg.icon))
    : null;

  return (
    <div className="relative aspect-video overflow-hidden group-hover:brightness-110 transition-all duration-500"
      style={{ background: `linear-gradient(135deg, ${cfg.accentHex}18, #0d0e18)` }}>

      {/* Real image */}
      {showRealImage && (
        <Image
          src={item.thumbnailUrl!}
          alt={`Thumbnail for ${item.title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          onError={() => setImgError(true)}
          unoptimized={
            item.thumbnailUrl?.startsWith("https://placehold.co") ||
            item.thumbnailUrl?.startsWith("data:")
          }
        />
      )}

      {/* SVG fallback — shown when no real image or image fails to load */}
      {!showRealImage && fallbackSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackSrc}
          alt={`${cfg.label} trending visual for ${item.title}`}
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Generic colour fallback (no SVG pattern defined) */}
      {!showRealImage && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${cfg.accentHex}20, #0d0e18)` }}>
          <span className="text-5xl opacity-25" aria-hidden="true">{cfg.icon}</span>
          <span className="text-xs font-mono opacity-30" style={{ color: cfg.accentHex }}>
            {cfg.label}
          </span>
        </div>
      )}

      {/* Rank badge — always visible */}
      <div className="rank-badge absolute top-3 left-3 font-bold z-10"
        style={{ background: cfg.accentHex, color: "#000" }}
        aria-label={`Rank ${item.rank}`}>
        #{item.rank}
      </div>

      {/* Duration badge */}
      {item.duration && (
        <span className="absolute bottom-2 right-2 text-xs font-mono px-2 py-0.5 rounded z-10"
          style={{ background: "rgba(0,0,0,0.8)", color: "white" }}>
          {item.duration}
        </span>
      )}

      {/* View count overlay on hover */}
      {item.viewCount != null && (
        <div className="absolute inset-0 flex items-end justify-start p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
          <span className="text-xs font-mono text-white">
            👁 {item.viewCount >= 1_000_000
              ? `${(item.viewCount / 1_000_000).toFixed(1)}M`
              : item.viewCount >= 1_000
              ? `${(item.viewCount / 1_000).toFixed(0)}K`
              : item.viewCount} views
          </span>
        </div>
      )}
    </div>
  );
}
