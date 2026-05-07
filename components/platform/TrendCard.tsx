import type { TrendItem } from "@/types";
import { PLATFORM_CONFIG } from "@/types";
import { formatNumber } from "@/lib/utils";
import ProsConsPanel from "./ProsConsPanel";
import CardThumbnail from "./CardThumbnail";

export default function TrendCard({ item }: { item: TrendItem }) {
  const cfg = PLATFORM_CONFIG[item.platform];

  return (
    <article
      role="listitem"
      aria-label={`Trending: ${item.title}`}
      className="card flex flex-col overflow-hidden group"
    >
      {/* Always renders — real image or branded SVG fallback */}
      <CardThumbnail item={item} />

      <div className="p-4 flex-1 flex flex-col">
        {/* Platform tag + sentiment */}
        <div className="flex items-center justify-between mb-2">
          <span className="platform-tag text-xs" style={{ color: cfg.accentHex }}>
            <span aria-hidden="true">{cfg.icon}</span>
            {cfg.label}
          </span>
          {item.sentiment && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium sentiment-${item.sentiment}`}
              aria-label={`Sentiment: ${item.sentiment}`}
            >
              {item.sentiment}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors"
          style={{ color: "var(--ink)" }}
        >
          {item.title}
        </h3>

        {/* Key insight */}
        {item.keyInsight && (
          <p
            className="text-xs italic mb-3 line-clamp-2"
            style={{
              color: cfg.accentHex,
              borderLeft: `2px solid ${cfg.accentHex}50`,
              paddingLeft: "8px",
            }}
          >
            {item.keyInsight}
          </p>
        )}

        {/* Summary or description */}
        {(item.summary || item.description) && (
          <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: "var(--ink-muted)" }}>
            {item.summary || item.description}
          </p>
        )}

        {/* Pros / Cons */}
        {(item.pros?.length || item.cons?.length) && (
          <ProsConsPanel pros={item.pros ?? []} cons={item.cons ?? []} />
        )}

        {/* Stats row */}
        <div
          className="flex flex-wrap gap-3 text-xs font-mono mt-auto pt-3 border-t"
          style={{ borderColor: "var(--border)", color: "var(--ink-faint)" }}
        >
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
          {item.commentCount != null && (
            <span aria-label={`${item.commentCount.toLocaleString()} comments`}>
              💬 {formatNumber(item.commentCount)}
            </span>
          )}
          {item.engagementRate != null && item.engagementRate > 0 && (
            <span aria-label={`${item.engagementRate.toFixed(1)}% engagement`}>
              ↗ {item.engagementRate.toFixed(1)}%
            </span>
          )}
        </div>

        {/* Author + CTA */}
        <div className="flex items-center justify-between mt-3">
          {item.author && (
            <span className="text-xs truncate max-w-[60%]" style={{ color: "var(--ink-faint)" }}>
              {item.author}
            </span>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${item.title} on ${cfg.label} (opens in new tab)`}
            className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-90 ml-auto"
            style={{
              background: `${cfg.accentHex}20`,
              color: cfg.accentHex,
              border: `0.5px solid ${cfg.accentHex}40`,
            }}
          >
            View →
          </a>
        </div>

        {/* Hashtags */}
        {item.hashtags && item.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2" aria-label="Hashtags">
            {item.hashtags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ background: "var(--surface-3)", color: "var(--ink-faint)" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
