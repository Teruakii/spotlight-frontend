"use client";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { listSavedPlaces, savePlace, unsavePlace } from "@/lib/api";

export default function SaveButton({ placeId, token }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listSavedPlaces(token)
      .then((places) => {
        if (!cancelled) setSaved(places.some((p) => p.id === placeId));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [placeId, token]);

  async function toggle() {
    const next = !saved;
    setSaved(next);
    setBusy(true);
    try {
      await (next ? savePlace(placeId, token) : unsavePlace(placeId, token));
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved places" : "Save place"}
      className={`rounded-xl border p-2.5 transition-all disabled:cursor-wait ${
        saved ? "border-amber-300 bg-amber-50" : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      <Bookmark
        className="h-5 w-5"
        strokeWidth={2}
        fill={saved ? "#D97706" : "none"}
        stroke={saved ? "#D97706" : "#71717A"}
      />
    </button>
  );
}
