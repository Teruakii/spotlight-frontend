"use client";
import { useState } from "react";
import { OTHER_COLOR, SERIES_COLORS } from "@/lib/chartColors";

const RADIUS = 44;
const STROKE = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2; // surface gap between segments, in px of arc length

// Largest categories keep a colour slot; the rest fold into "Other".
function toSlices(mix) {
  const sorted = [...mix].filter((c) => c.count > 0).sort((a, b) => b.count - a.count);
  const named = sorted.slice(0, SERIES_COLORS.length).map((c, i) => ({ ...c, color: SERIES_COLORS[i] }));
  const rest = sorted.slice(SERIES_COLORS.length);
  if (rest.length) {
    named.push({ id: "other", name: "Other", count: rest.reduce((s, c) => s + c.count, 0), color: OTHER_COLOR });
  }
  return named;
}

function compact(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function CategoryMix({ mix }) {
  const [active, setActive] = useState(null);
  const slices = toSlices(mix);
  const total = slices.reduce((s, c) => s + c.count, 0);

  if (!total) return <p className="py-8 text-center text-xs text-zinc-400">No published places yet.</p>;

  let offset = 0;
  const arcs = slices.map((slice) => {
    const length = (slice.count / total) * CIRCUMFERENCE;
    const arc = { ...slice, length: Math.max(0, length - (slices.length > 1 ? GAP : 0)), offset };
    offset += length;
    return arc;
  });
  const focus = arcs.find((a) => a.id === active);

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-28 w-28 shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" role="img" aria-label="Published places by category">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#F4F4F5" strokeWidth={STROKE} />
          {arcs.map((arc) => (
            <circle
              key={arc.id}
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth={active === arc.id ? STROKE + 3 : STROKE}
              strokeDasharray={`${arc.length} ${CIRCUMFERENCE}`}
              strokeDashoffset={-arc.offset}
              onMouseEnter={() => setActive(arc.id)}
              onMouseLeave={() => setActive(null)}
              className="cursor-default transition-[stroke-width]"
            >
              <title>{`${arc.name}: ${arc.count}`}</title>
            </circle>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-zinc-900">{compact(focus ? focus.count : total)}</span>
          <span className="max-w-[4.5rem] truncate text-[10px] text-zinc-400">{focus ? focus.name : "total"}</span>
        </div>
      </div>
      <ul className="flex-1 space-y-2.5">
        {arcs.map((arc) => (
          <li
            key={arc.id}
            onMouseEnter={() => setActive(arc.id)}
            onMouseLeave={() => setActive(null)}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex min-w-0 items-center gap-2 text-zinc-500">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: arc.color }} />
              <span className="truncate">{arc.name}</span>
            </span>
            <span className="font-medium tabular-nums text-zinc-900">
              {Math.round((arc.count / total) * 100)}%
              <span className="ml-1 font-normal text-zinc-400">({arc.count})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
