import Link from "next/link";

const PLATFORMS = [
  { name: "YouTube", color: "#FF4444" },
  { name: "TikTok", color: "#00F2EA" },
  { name: "Reddit", color: "#FF6314" },
  { name: "Instagram", color: "#E1306C" },
  { name: "X / Twitter", color: "#E7E7F0" },
  { name: "Google Trends", color: "#4285F4" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer role="contentinfo" className="border-t py-12 px-4"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl mb-2" style={{ color: "var(--ink)" }}>
              WHAT'S TRENDING TODAY
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              Your daily pulse on what the world is watching, sharing, and searching. Updated every hour across 6 platforms.
            </p>
          </div>
          {/* Platforms */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: "var(--ink-faint)" }}>Sources</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <span key={p.name} className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ borderColor: `${p.color}40`, color: p.color, background: `${p.color}10` }}>
                  {p.name}
                </span>
              ))}
            </div>
          </div>
          {/* Links */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: "var(--ink-faint)" }}>Pages</p>
            <nav aria-label="Footer navigation" className="space-y-2">
              {[
                { href: "/", label: "Today's Trends" },
                { href: "/about", label: "About" },
                { href: "/rss.xml", label: "RSS Feed" },
                { href: "/sitemap.xml", label: "Sitemap" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="block text-sm transition-colors hover:text-white"
                  style={{ color: "var(--ink-muted)" }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-mono" style={{ color: "var(--ink-faint)" }}>
            © {year} WhatsTrendingToday.com
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--ink-faint)" }}>
            Powered by YouTube · TikTok · Reddit · Instagram · X · Google · Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
