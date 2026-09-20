"use client";
import { X, Plus } from "lucide-react";
import { inputClass, labelClass, secondaryButton } from "@/lib/styles";

export default function TransportListInput({ transports, onChange, draft, onDraftChange }) {
  const { method, detail } = draft;

  function addTransport() {
    if (!method.trim() || !detail.trim()) return;
    onChange([...transports, { method: method.trim(), detail: detail.trim() }]);
    onDraftChange({ method: "", detail: "" });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTransport();
    }
  }

  return (
    <div>
      <label htmlFor="transport-method" className={labelClass}>Getting there</label>
      <div className="mb-2 flex gap-2">
        <div className="w-28 shrink-0">
          <input
            id="transport-method"
            value={method}
            onChange={(e) => onDraftChange({ ...draft, method: e.target.value })}
            onKeyDown={handleKeyDown}
            maxLength={50}
            placeholder="Bus"
            aria-label="Transport method"
            className={inputClass}
          />
        </div>
        <div className="min-w-0 flex-1">
          <input
            value={detail}
            onChange={(e) => onDraftChange({ ...draft, detail: e.target.value })}
            onKeyDown={handleKeyDown}
            maxLength={255}
            placeholder="Lines 1, 3, 6 to Sanam Chai"
            aria-label="Transport detail"
            className={inputClass}
          />
        </div>
        <button type="button" onClick={addTransport} aria-label="Add transport" className={`${secondaryButton} shrink-0 rounded-xl px-3`}>
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {transports.length > 0 && (
        <ul className="space-y-2">
          {transports.map((t, i) => (
            <li
              key={t.id ?? `${t.method}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2"
            >
              <span className="shrink-0 rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                {t.method}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">{t.detail}</span>
              {t.id ? (
                <span className="text-xs text-zinc-300">Saved</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onChange(transports.filter((_, idx) => idx !== i))}
                  aria-label="Remove transport"
                  className="p-1 text-zinc-400 transition-colors hover:text-zinc-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
