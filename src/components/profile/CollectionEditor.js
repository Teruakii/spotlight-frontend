"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ImageOff, X } from "lucide-react";
import {
  addCollectionItem,
  deleteCollection,
  removeCollectionItem,
  setCollectionLayout,
  updateCollection,
} from "@/lib/api";
import { groupByDay, moveToDay, moveWithinDay, setStartTime } from "@/lib/itinerary";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass } from "@/lib/styles";

const iconButton =
  "flex h-7 w-7 items-center justify-center rounded border border-zinc-200 text-zinc-400 transition-colors hover:text-zinc-700 disabled:opacity-30";

function ItemRow({ item, index, dayCount, busy, onMove, onMoveToDay, onTime, onRemove, isFirst, isLast }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-100 p-2.5 sm:flex-nowrap">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">
        {index + 1}
      </span>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
        {item.place.imageUrl ? (
          <img src={item.place.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="h-3.5 w-3.5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/places/${item.place.id}`} className="block truncate text-xs font-medium text-zinc-900 hover:underline">
          {item.place.name}
        </Link>
        <p className="text-[10px] text-zinc-400">
          {item.place.category?.name}
          {item.place.status !== "approved" && " · no longer published"}
        </p>
      </div>
      <input
        type="time"
        value={item.startTime ?? ""}
        onChange={(e) => onTime(item.id, e.target.value)}
        disabled={busy}
        aria-label={`Start time for ${item.place.name}`}
        className="w-[5.5rem] rounded border border-zinc-200 px-1.5 py-1 text-[11px] text-zinc-600 outline-none focus:border-zinc-400"
      />
      <select
        value={item.day}
        onChange={(e) => onMoveToDay(item.id, Number(e.target.value))}
        disabled={busy}
        aria-label={`Day for ${item.place.name}`}
        className="rounded border border-zinc-200 bg-white px-1.5 py-1 text-[11px] text-zinc-600 outline-none"
      >
        {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
          <option key={day} value={day}>
            Day {day}
          </option>
        ))}
      </select>
      <div className="flex gap-1">
        <button onClick={() => onMove(item.id, -1)} disabled={busy || isFirst} aria-label="Move up" className={iconButton}>
          <ArrowUp className="h-3 w-3" />
        </button>
        <button onClick={() => onMove(item.id, 1)} disabled={busy || isLast} aria-label="Move down" className={iconButton}>
          <ArrowDown className="h-3 w-3" />
        </button>
        <button
          onClick={() => onRemove(item.id)}
          disabled={busy}
          aria-label={`Remove ${item.place.name}`}
          className={`${iconButton} hover:text-red-500`}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export default function CollectionEditor({ collection, savedPlaces, token, onChange, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [extraDays, setExtraDays] = useState(0);
  const [placeToAdd, setPlaceToAdd] = useState("");
  const [copied, setCopied] = useState(false);

  const usedDays = collection.items.reduce((max, item) => Math.max(max, item.day), 1);
  const dayCount = usedDays + extraDays;
  const days = groupByDay(collection.items);
  const addable = savedPlaces.filter((p) => !collection.items.some((item) => item.place.id === p.id));

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      const updated = await action();
      if (updated) onChange(updated);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const saveLayout = (layout) => layout && run(() => setCollectionLayout(collection.id, layout, token));

  function handleAdd(e) {
    e.preventDefault();
    if (!placeToAdd) return;
    run(async () => {
      const updated = await addCollectionItem(collection.id, { placeId: Number(placeToAdd), day: dayCount }, token);
      setPlaceToAdd("");
      setExtraDays(0);
      return updated;
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete “${collection.name}”? This cannot be undone.`)) return;
    run(async () => {
      await deleteCollection(collection.id, token);
      onDeleted(collection.id);
    });
  }

  async function handleShare() {
    const url = `${window.location.origin}/collections/${collection.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  let runningIndex = 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700">
            {usedDays}-day itinerary
          </span>
          <h3 className="mt-1 text-base font-semibold text-zinc-900">{collection.name}</h3>
          <p className="mt-0.5 text-[10px] text-zinc-400">
            {collection.items.length} places · {collection.isPrivate ? "Private" : "Public"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => run(() => updateCollection(collection.id, { isPrivate: !collection.isPrivate }, token))}
            disabled={busy}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-400 disabled:opacity-60"
          >
            Make {collection.isPrivate ? "public" : "private"}
          </button>
          {!collection.isPrivate && (
            <button
              onClick={handleShare}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-400"
            >
              {copied ? "Link copied ✓" : "Share collection"}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={busy}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}

      {collection.items.length === 0 && (
        <p className="mb-4 rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-xs text-zinc-400">
          No places yet. Add one of your saved places below.
        </p>
      )}

      <div className="space-y-5">
        {days.map(({ day, items }) => (
          <div key={day}>
            <p className="mb-2 text-xs font-semibold text-zinc-900">Day {day}</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  index={runningIndex++}
                  dayCount={dayCount}
                  busy={busy}
                  isFirst={i === 0}
                  isLast={i === items.length - 1}
                  onMove={(id, delta) => saveLayout(moveWithinDay(collection.items, id, delta))}
                  onMoveToDay={(id, toDay) => saveLayout(moveToDay(collection.items, id, toDay))}
                  onTime={(id, time) => saveLayout(setStartTime(collection.items, id, time))}
                  onRemove={(id) => run(() => removeCollectionItem(collection.id, id, token))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap gap-2">
        <select
          value={placeToAdd}
          onChange={(e) => setPlaceToAdd(e.target.value)}
          disabled={busy || addable.length === 0}
          aria-label="Saved place to add"
          className="min-w-0 flex-1 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-600 outline-none"
        >
          <option value="">{addable.length ? "+ Add saved place…" : "Save more places to add them here"}</option>
          {addable.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={busy || !placeToAdd}
          className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
        >
          Add to day {dayCount}
        </button>
        <button
          type="button"
          onClick={() => setExtraDays((n) => Math.min(n + 1, 30 - usedDays))}
          disabled={busy || dayCount >= 30}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-500 hover:border-zinc-400 disabled:opacity-40"
        >
          + Add day
        </button>
      </form>
    </div>
  );
}
