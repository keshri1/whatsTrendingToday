"use client";
import { useRouter } from "next/navigation";
import { format, subDays, addDays, parseISO, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateNavProps { currentDate: string; }

export default function DateNav({ currentDate }: DateNavProps) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const current = new Date(currentDate + "T12:00:00");
  const isCurrentToday = currentDate === today;

  const goTo = (date: string) => {
    if (date === today) router.push("/");
    else router.push(`/?date=${date}`);
  };

  // Last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(today + "T12:00:00"), 6 - i);
    return d.toISOString().split("T")[0];
  });

  return (
    <nav aria-label="Browse by date" className="mb-8 mt-2">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Prev */}
        <button
          onClick={() => goTo(subDays(current, 1).toISOString().split("T")[0])}
          className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors hover:border-white/20"
          style={{ border: "0.5px solid var(--border)", color: "var(--ink-muted)" }}
          aria-label="Previous day"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Day pills */}
        <div className="tabs-scroll flex items-center gap-2">
          {days.map((day) => {
            const isActive = day === currentDate;
            const isTod = day === today;
            const label = isTod ? "Today" : format(new Date(day + "T12:00:00"), "MMM d");
            return (
              <button
                key={day}
                onClick={() => goTo(day)}
                aria-label={`View trends for ${format(new Date(day + "T12:00:00"), "MMMM d, yyyy")}`}
                aria-current={isActive ? "date" : undefined}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={isActive ? {
                  background: "linear-gradient(135deg, rgba(255,68,68,0.3), rgba(66,133,244,0.3))",
                  border: "0.5px solid rgba(255,255,255,0.2)",
                  color: "var(--ink)",
                } : {
                  background: "var(--surface-2)",
                  border: "0.5px solid var(--border)",
                  color: "var(--ink-muted)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Next — disabled for today */}
        <button
          onClick={() => { if (!isCurrentToday) goTo(addDays(current, 1).toISOString().split("T")[0]); }}
          disabled={isCurrentToday}
          className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors disabled:opacity-30"
          style={{ border: "0.5px solid var(--border)", color: "var(--ink-muted)" }}
          aria-label="Next day"
          aria-disabled={isCurrentToday}
        >
          <ChevronRight size={15} />
        </button>

        {/* Today button — only show if not on today */}
        {!isCurrentToday && (
          <button
            onClick={() => goTo(today)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{ background: "rgba(62,207,176,0.1)", color: "#3ECFB0", border: "0.5px solid rgba(62,207,176,0.3)" }}
          >
            <Calendar size={11} />
            Today
          </button>
        )}
      </div>
    </nav>
  );
}
