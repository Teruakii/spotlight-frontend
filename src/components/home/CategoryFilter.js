"use client";

export default function CategoryFilter({ categories, active, onChange }) {
  const items = [{ id: null, name: "All" }, ...categories];

  return (
    <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-zinc-200 bg-zinc-100 p-1">
      {items.map((item) => (
        <button
          key={item.id ?? "all"}
          onClick={() => onChange(item.id)}
          className={`whitespace-nowrap rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
            active === item.id
              ? "border border-zinc-200 bg-white text-zinc-900 shadow-sm"
              : "border border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
