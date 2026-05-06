import { format } from "date-fns";

interface Props { note: string; generatedAt: string; }

export default function EditorNote({ note, generatedAt }: Props) {
  const time = format(new Date(generatedAt), "h:mm a");
  return (
    <aside
      aria-label="Editor's note — AI-generated daily summary"
      className="relative mb-10 p-5 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(66,133,244,0.08), rgba(255,68,68,0.06))",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">✦</span>
        <div>
          <p className="text-xs font-mono mb-1.5" style={{ color: "var(--ink-faint)" }}>
            AI EDITOR'S NOTE — Updated {time}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            {note}
          </p>
        </div>
      </div>
    </aside>
  );
}
