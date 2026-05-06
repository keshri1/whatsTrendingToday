export default function TrendGridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading trending content">
      {/* Editor note skeleton */}
      <div className="skeleton h-16 w-full mb-10 rounded-2xl" />
      {/* Top story skeleton */}
      <div className="skeleton h-64 w-full mb-16 rounded-2xl" />
      {/* Section skeletons */}
      {[1, 2, 3].map((s) => (
        <div key={s} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="skeleton h-8 w-40 rounded" />
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" }}>
            {[1, 2, 3, 4, 5].map((c) => (
              <div key={c} className="card overflow-hidden">
                <div className="skeleton aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
