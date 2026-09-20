"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageOff, Plus, Search } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Tabs from "@/components/ui/Tabs";
import { cardClass, errorBannerClass, primaryButton } from "@/lib/styles";
import { errorMessage } from "@/lib/utils";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

export default function PlacesTable({ places, onDelete }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const tabs = STATUS_TABS.map((tab) => ({
    ...tab,
    count: tab.key === "all" ? places.length : places.filter((p) => p.status === tab.key).length,
  }));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return places.filter(
      (p) => (status === "all" || p.status === status) && (!query || p.name.toLowerCase().includes(query))
    );
  }, [places, search, status]);

  async function handleDelete(id) {
    setBusyId(id);
    setError("");
    try {
      await onDelete(id);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
      setConfirmingId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search places…"
            aria-label="Search places"
            className="w-56 rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
          />
        </div>
        <Link href="/places/new" className={`${primaryButton} rounded-lg`}>
          <Plus className="h-3.5 w-3.5" />
          Add place
        </Link>
      </div>

      <div className="mb-4">
        <Tabs tabs={tabs} active={status} onChange={setStatus} />
      </div>

      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}

      <div className={`${cardClass} overflow-x-auto`}>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Place</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Category</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Status</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Rating</th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((place) => {
              const cover = place.images?.[0]?.imageUrl;
              return (
                <tr key={place.id} className="border-b border-zinc-50 transition-colors last:border-none hover:bg-zinc-50">
                  <td className="px-5 py-4">
                    <Link href={`/places/${place.id}`} className="flex items-center gap-3">
                      <div className="flex h-8 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
                        {cover ? (
                          <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <ImageOff className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{place.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-zinc-500">{place.category?.name}</td>
                  <td className="px-4 py-4"><StatusBadge status={place.status} /></td>
                  <td className="px-4 py-4 text-zinc-500">
                    {place.rating !== null ? `${place.rating} (${place.reviewCount})` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3 text-xs font-medium">
                      {confirmingId === place.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(place.id)}
                            disabled={busyId === place.id}
                            className="text-red-500 hover:text-red-600 disabled:opacity-60"
                          >
                            {busyId === place.id ? "Deleting…" : "Confirm delete"}
                          </button>
                          <button onClick={() => setConfirmingId(null)} className="text-zinc-400 hover:text-zinc-600">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href={`/places/${place.id}/edit`} className="text-zinc-500 transition-colors hover:text-zinc-800">
                            Edit
                          </Link>
                          <button
                            onClick={() => setConfirmingId(place.id)}
                            className="text-red-400 transition-colors hover:text-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-zinc-400">No places match these filters.</p>
        )}
      </div>
    </div>
  );
}
