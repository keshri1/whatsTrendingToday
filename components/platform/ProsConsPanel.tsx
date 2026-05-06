interface Props { pros: string[]; cons: string[]; }

export default function ProsConsPanel({ pros, cons }: Props) {
  if (!pros.length && !cons.length) return null;
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      {pros.length > 0 && (
        <div className="card-3 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#3ECFB0" }}>
            ✓ Pros
          </p>
          <ul className="space-y-1">
            {pros.slice(0, 2).map((p, i) => (
              <li key={i} className="text-[11px] leading-tight flex gap-1" style={{ color: "var(--ink-muted)" }}>
                <span className="text-green-400 flex-shrink-0" aria-hidden="true">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons.length > 0 && (
        <div className="card-3 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#F05C6A" }}>
            ✗ Cons
          </p>
          <ul className="space-y-1">
            {cons.slice(0, 2).map((c, i) => (
              <li key={i} className="text-[11px] leading-tight flex gap-1" style={{ color: "var(--ink-muted)" }}>
                <span className="text-red-400 flex-shrink-0" aria-hidden="true">−</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
