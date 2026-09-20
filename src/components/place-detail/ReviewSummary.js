export default function ReviewSummary({ reviews, average }) {
  if (!reviews.length) {
    return (
      <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-400">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="mb-8 flex items-center gap-5 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="text-center">
        <p className="mb-1 text-5xl font-light leading-none text-zinc-900">{average.toFixed(1)}</p>
        <p className="text-xs text-zinc-400">out of 5</p>
      </div>
      <div className="flex-1">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter((r) => r.rating === stars).length;
          const pct = Math.round((count / reviews.length) * 100);
          return (
            <div key={stars} className="mb-1 flex items-center gap-2">
              <span className="w-2 text-xs text-zinc-400">{stars}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full rounded-full bg-amber-600" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-8 text-right text-xs text-zinc-400">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
