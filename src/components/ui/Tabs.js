"use client";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex overflow-x-auto border-b border-zinc-200" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
            active === tab.key ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">
              {tab.count}
            </span>
          )}
          {active === tab.key && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-zinc-900" />
          )}
        </button>
      ))}
    </div>
  );
}
