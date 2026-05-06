"use client";
import { useState, createContext, useContext } from "react";
import type { Platform } from "@/types";
import { PLATFORM_CONFIG } from "@/types";

const TabCtx = createContext<{ active: Platform | "all"; setActive: (p: Platform | "all") => void }>({
  active: "all",
  setActive: () => {},
});

export function useTab() { return useContext(TabCtx); }

const TABS: { id: Platform | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All Platforms", emoji: "🌐" },
  { id: "youtube", label: "YouTube", emoji: "▶" },
  { id: "tiktok", label: "TikTok", emoji: "♪" },
  { id: "reddit", label: "Reddit", emoji: "↑" },
  { id: "instagram", label: "Instagram", emoji: "◈" },
  { id: "twitter", label: "X / Twitter", emoji: "𝕏" },
  { id: "google", label: "Google", emoji: "⟳" },
];

export default function PlatformTabs({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Platform | "all">("all");

  return (
    <TabCtx.Provider value={{ active, setActive }}>
      {/* Tab bar */}
      <div role="tablist" aria-label="Filter by platform" className="tabs-scroll flex items-center gap-1 mb-8">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const cfg = tab.id !== "all" ? PLATFORM_CONFIG[tab.id as Platform] : null;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
              style={isActive ? {
                background: cfg ? `${cfg.accentHex}22` : "rgba(255,255,255,0.08)",
                border: `0.5px solid ${cfg ? cfg.accentHex + "55" : "rgba(255,255,255,0.25)"}`,
                color: cfg ? cfg.accentHex : "var(--ink)",
              } : {
                background: "transparent",
                border: "0.5px solid var(--border)",
                color: "var(--ink-muted)",
              }}
            >
              <span aria-hidden="true">{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {children}
    </TabCtx.Provider>
  );
}
