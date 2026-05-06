"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Rss } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b" : ""
      }`}
      style={{
        background: scrolled ? "rgba(3,4,10,0.88)" : "transparent",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="What's Trending Today — Home">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #FF4444, #4285F4, #00F2EA)" }}>
            <span className="text-white font-bold text-sm relative z-10">W</span>
          </div>
          <span className="font-display text-xl tracking-wide hidden sm:block" style={{ color: "var(--ink)" }}>
            WHAT'S TRENDING
          </span>
          <span className="font-display text-xl tracking-wide sm:hidden" style={{ color: "var(--ink)" }}>
            WTT
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border"
            style={{ borderColor: "rgba(62,207,176,0.3)", background: "rgba(62,207,176,0.06)", color: "#3ECFB0" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" aria-hidden="true" />
            LIVE
          </div>
          <button
            aria-label="Search trending topics"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ background: "var(--surface-2)", color: "var(--ink-muted)" }}
          >
            <Search size={15} aria-hidden="true" />
          </button>
          <a
            href="/rss.xml"
            aria-label="RSS Feed"
            className="w-9 h-9 hidden sm:flex items-center justify-center rounded-full transition-colors"
            style={{ background: "var(--surface-2)", color: "var(--ink-muted)" }}
          >
            <Rss size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Skip link */}
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg"
        style={{ background: "var(--surface)", color: "var(--ink)" }}>
        Skip to main content
      </a>
    </header>
  );
}
