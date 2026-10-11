"use client";
import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { createCollection, getCollection, listMyCollections } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass, inputClass } from "@/lib/styles";
import CollectionEditor from "@/components/profile/CollectionEditor";
import PageMessage from "@/components/ui/PageMessage";

function summarize(collection) {
  return {
    id: collection.id,
    name: collection.name,
    isPrivate: collection.isPrivate,
    itemCount: collection.items.length,
    dayCount: collection.items.reduce((max, item) => Math.max(max, item.day), 0),
    coverImages: collection.items.map((item) => item.place.imageUrl).filter(Boolean).slice(0, 2),
  };
}

export default function CollectionsPanel({ token, savedPlaces }) {
  const [collections, setCollections] = useState(null);
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listMyCollections(token)
      .then((list) => {
        setCollections(list);
        if (list.length) return getCollection(list[0].id, token).then(setSelected);
      })
      .catch((err) => {
        setCollections([]);
        setError(errorMessage(err));
      });
  }, [token]);

  async function open(id) {
    setError("");
    try {
      setSelected(await getCollection(id, token));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const created = await createCollection({ name: newName.trim() }, token);
      setCollections((list) => [summarize(created), ...list]);
      setSelected(created);
      setNewName("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  function handleChange(updated) {
    setSelected(updated);
    setCollections((list) => list.map((c) => (c.id === updated.id ? summarize(updated) : c)));
  }

  function handleDeleted(id) {
    setSelected(null);
    setCollections((list) => list.filter((c) => c.id !== id));
  }

  if (collections === null) return <PageMessage>Loading your collections…</PageMessage>;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Your plans</h2>
          <p className="mt-1 text-xs text-zinc-400">Collect places and shape them into a day-by-day trip.</p>
        </div>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={100}
            placeholder="New collection name"
            aria-label="New collection name"
            className={`${inputClass} w-48 py-2 text-xs`}
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="whitespace-nowrap rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40"
          >
            + New collection
          </button>
        </form>
      </div>

      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}

      {collections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 px-6 py-14 text-center text-sm text-zinc-400">
          No collections yet. Name one above to start planning a trip.
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-3">
            {collections.map((c) => (
              <button
                key={c.id}
                onClick={() => open(c.id)}
                aria-pressed={selected?.id === c.id}
                className={`block w-full overflow-hidden rounded-xl border bg-white text-left transition-colors ${
                  selected?.id === c.id ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="grid h-24 grid-cols-2 gap-0.5 bg-zinc-200">
                  {[0, 1].map((i) =>
                    c.coverImages[i] ? (
                      <img key={i} src={c.coverImages[i]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div key={i} className="flex items-center justify-center bg-zinc-100 text-zinc-300">
                        <ImageOff className="h-4 w-4" />
                      </div>
                    )
                  )}
                </div>
                <div className="p-4">
                  {c.dayCount > 0 && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700">
                      {c.dayCount}-day itinerary
                    </span>
                  )}
                  <p className="mt-0.5 text-sm font-semibold text-zinc-900">{c.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {c.itemCount} places · {c.isPrivate ? "Private" : "Public"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <CollectionEditor
              key={selected.id}
              collection={selected}
              savedPlaces={savedPlaces}
              token={token}
              onChange={handleChange}
              onDeleted={handleDeleted}
            />
          )}
        </div>
      )}
    </div>
  );
}
