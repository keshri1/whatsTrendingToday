import Image from "next/image";
import type { TrendItem } from "@/types";
import { PLATFORM_CONFIG } from "@/types";
import { formatNumber } from "@/lib/utils";

export default function TopStoryHero({ item }: { item: TrendItem }) {
  const cfg = PLATFORM_CONFIG[item.platform];

  return (
    <article
      aria-label={`Top story: ${item.title}`}
      className="relative mb-16 rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cfg.accentHex}18 0%, var(--surface) 60%)`,
        border: `0.5px solid ${cfg.accentHex}30`,
      }}
    >
      <div className="flex flex-col md:flex-row gap-0">
        {/* Thumbnail */}
        {item.thumbnailUrl && (
          <div className="relative md:w-2/5 aspect-video md:aspect-auto md:min-h-[280px]">
            <Image
              src={item.thumbnailUrl}
              alt={`Thumbnail for ${item.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent 60%, var(--surface))" }} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold px-2 py-1 rounded"
              style={{ background: `${cfg.accentHex}20`, color: cfg.accentHex }}>
              ★ TOP STORY
            </span>
            <span className="platform-tag" style={{ color: cfg.accentHex }}>
              <span aria-hidden="true">{cfg.icon}</span>
              {cfg.label}
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl leading-tight mb-3"
            style={{ color: "var(--ink)" }}>
            {item.title}
          </h2>

          {item.keyInsight && (
            <p className="text-base italic mb-4" style={{ color: cfg.accentHex }}>
              "{item.keyInsight}"
            </p>
          )}

          {item.summary && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-muted)" }}>
              {item.summary}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-sm font-mono" style={{ color: "var(--ink-faint)" }}>
            {item.viewCount != null && (
              <span aria-label={`${item.viewCount.toLocaleString()} views`}>
                👁 {formatNumber(item.viewCount)}
              </span>
            )}
            {item.likeCount != null && (
              <span aria-label={`${item.likeCount.toLocaleString()} likes`}>
                ♥ {formatNumber(item.likeCount)}
              </span>
            )}
            {item.engagementRate != null && (
              <span aria-label={`${item.engagementRate.toFixed(1)}% engagement rate`}>
                ↗ {item.engagementRate.toFixed(1)}%
              </span>
            )}
            {item.author && <span>by {item.author}</span>}
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium self-start transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: cfg.accentHex, color: "#000" }}
            aria-label={`Watch or view: ${item.title} (opens in new tab)`}
          >
            View on {cfg.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}
