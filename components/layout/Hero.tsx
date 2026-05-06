import { format } from "date-fns";

interface HeroProps {
  date: string;
  isToday: boolean;
}

export default function Hero({ date, isToday }: HeroProps) {
  const formatted = format(new Date(date + "T12:00:00"), "EEEE, MMMM d");
  const year = format(new Date(date + "T12:00:00"), "yyyy");

  return (
    <section
      className="relative pt-20 pb-12 overflow-hidden noise"
      aria-label="Page header"
      style={{ minHeight: "340px" }}
    >
      {/* Aurora background */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob" style={{ width: 600, height: 600, top: -200, left: -100, background: "#FF4444" }} />
        <div className="aurora-blob" style={{ width: 500, height: 500, top: -150, right: 0, background: "#4285F4" }} />
        <div className="aurora-blob" style={{ width: 400, height: 400, bottom: -100, left: "40%", background: "#00F2EA" }} />
        <div className="aurora-blob" style={{ width: 300, height: 300, top: 50, right: "30%", background: "#E1306C" }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Date label */}
        <div className="flex items-center gap-2 mb-4">
          {isToday && (
            <span className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border"
              style={{ borderColor: "rgba(62,207,176,0.35)", background: "rgba(62,207,176,0.08)", color: "#3ECFB0" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" aria-hidden="true" />
              UPDATING NOW
            </span>
          )}
          <span className="text-xs font-mono" style={{ color: "var(--ink-faint)" }}>
            {year}
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-6xl sm:text-8xl md:text-[10rem] leading-none mb-4 tracking-wide"
          style={{ color: "var(--ink)" }}>
          <span className="block">WHAT'S</span>
          <span className="block" style={{
            background: "linear-gradient(135deg, #FF4444 0%, #FF6314 20%, #E1306C 40%, #4285F4 70%, #00F2EA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>TRENDING</span>
        </h1>

        {/* Date + source count */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <p className="text-xl sm:text-2xl font-light" style={{ color: "var(--ink-muted)" }}>
            {formatted}
          </p>
          <div className="flex items-center gap-2">
            {["YouTube", "TikTok", "Reddit", "Instagram", "X", "Google"].map((p) => (
              <span key={p} className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ background: "var(--surface-2)", color: "var(--ink-faint)", border: "0.5px solid var(--border)" }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
