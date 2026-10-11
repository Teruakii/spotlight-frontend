"use client";
import { useState } from "react";
import { SERIES_COLORS } from "@/lib/chartColors";

const WIDTH = 700;
const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 36 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

const SERIES = [
  { key: "visits", label: "Visits", color: SERIES_COLORS[0] },
  { key: "reviews", label: "Reviews", color: SERIES_COLORS[1] },
];

// A "nice" upper bound (1, 2, 5 × 10^n) so gridlines land on round numbers.
function niceMax(value) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((m) => m * magnitude >= value / 4) * magnitude;
  return step * 4;
}

export default function ActivityChart({ series }) {
  const [hover, setHover] = useState(null);
  const [asTable, setAsTable] = useState(false);
  const { labels } = series;
  const count = labels.length;
  const max = niceMax(Math.max(1, ...series.visits, ...series.reviews));

  const x = (i) => PAD.left + (count === 1 ? PLOT_W / 2 : (i / (count - 1)) * PLOT_W);
  const y = (v) => PAD.top + PLOT_H - (v / max) * PLOT_H;
  const ticks = [0, 1, 2, 3, 4].map((n) => (max / 4) * n);
  const labelEvery = Math.ceil(count / 7);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const i = Math.round(((px - PAD.left) / PLOT_W) * (count - 1));
    setHover(Math.max(0, Math.min(count - 1, i)));
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
        <button onClick={() => setAsTable((v) => !v)} className="text-xs font-medium text-zinc-400 hover:text-zinc-700">
          {asTable ? "View chart" : "View as table"}
        </button>
      </div>

      {asTable ? (
        <div className="max-h-56 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-zinc-400">
                <th className="py-1.5 font-medium">Period</th>
                {SERIES.map((s) => (
                  <th key={s.key} className="py-1.5 text-right font-medium">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((label, i) => (
                <tr key={label} className="border-t border-zinc-100 text-zinc-700">
                  <td className="py-1.5">{label}</td>
                  {SERIES.map((s) => (
                    <td key={s.key} className="py-1.5 text-right tabular-nums">{series[s.key][i]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            className="h-56 w-full"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`Visits and reviews over ${count} periods`}
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(t)} y2={y(t)} stroke="#F4F4F5" strokeWidth="1" />
                <text x={PAD.left - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#A1A1AA">
                  {t}
                </text>
              </g>
            ))}
            {labels.map((label, i) =>
              i % labelEvery === 0 || i === count - 1 ? (
                <text key={label} x={x(i)} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill="#A1A1AA">
                  {label}
                </text>
              ) : null
            )}
            {hover !== null && (
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="#D4D4D8" strokeWidth="1" />
            )}
            {SERIES.map((s) => (
              <polyline
                key={s.key}
                points={series[s.key].map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {hover !== null &&
              SERIES.map((s) => (
                <circle
                  key={s.key}
                  cx={x(hover)}
                  cy={y(series[s.key][hover])}
                  r="4.5"
                  fill={s.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              ))}
          </svg>
          {hover !== null && (
            <div
              className="pointer-events-none absolute top-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm"
              style={{
                left: `${(x(hover) / WIDTH) * 100}%`,
                transform: hover > count / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
              }}
            >
              <p className="mb-1 font-semibold text-zinc-900">{labels[hover]}</p>
              {SERIES.map((s) => (
                <p key={s.key} className="flex items-center gap-1.5 text-zinc-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                  <span className="ml-auto pl-3 font-medium tabular-nums text-zinc-900">{series[s.key][hover]}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
