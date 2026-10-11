"use client";

const OPTIONS = [
  { key: "popular", label: "Popular" },
  { key: "nearby", label: "Nearby" },
  { key: "top", label: "Top rated" },
  { key: "newest", label: "Newest" },
];

export default function SortChips({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <span className="mr-1 text-xs font-medium text-zinc-400">Sort</span>
      {OPTIONS.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
            value === option.key
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
