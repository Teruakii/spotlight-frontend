"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ImageOff, Star } from "lucide-react";
import { formatDistance } from "@/lib/utils";

const PlaceMap = dynamic(() => import("@/components/home/PlaceMap"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full animate-pulse bg-zinc-100 motion-reduce:animate-none" />,
});

function hasCoordinates(place) {
  return place.latitude !== null && place.latitude !== undefined && place.longitude !== null && place.longitude !== undefined;
}

export default function PlaceMapView({ places }) {
  const mappable = useMemo(() => places.filter(hasCoordinates), [places]);
  const [selectedId, setSelectedId] = useState(null);
  const selected = mappable.find((p) => p.id === selectedId) ?? mappable[0] ?? null;

  const pins = useMemo(
    () =>
      mappable.map((place, index) => ({
        id: place.id,
        name: place.name,
        label: index + 1,
        lat: Number(place.latitude),
        lng: Number(place.longitude),
      })),
    [mappable]
  );

  if (!mappable.length) {
    return <div className="py-20 text-center text-sm text-zinc-400">None of these places have a map location yet.</div>;
  }

  return (
    <div className="grid min-h-[520px] overflow-hidden rounded-xl border border-zinc-200 bg-white lg:grid-cols-[1fr_2fr]">
      <div className="max-h-[520px] space-y-2 overflow-y-auto border-b border-zinc-200 p-3 lg:border-b-0 lg:border-r">
        {mappable.map((place, index) => {
          const cover = place.images?.[0]?.imageUrl;
          const active = selected?.id === place.id;
          return (
            <button
              key={place.id}
              onClick={() => setSelectedId(place.id)}
              aria-pressed={active}
              className={`flex w-full gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                active ? "border-zinc-900 bg-zinc-50" : "border-transparent hover:bg-zinc-50"
              }`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
                {cover ? <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ImageOff className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-zinc-900">
                  {index + 1}. {place.name}
                </p>
                <p className="mt-1 text-[10px] text-zinc-400">
                  {place.category?.name}
                  {place.distanceKm !== undefined && ` · ${formatDistance(place.distanceKm)}`}
                </p>
                {place.rating !== null && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium">
                    <Star className="h-3 w-3 fill-amber-600 text-amber-600" /> {place.rating}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative isolate min-h-[360px]">
        <PlaceMap pins={pins} selectedId={selected?.id} onSelect={setSelectedId} />
        {selected && (
          <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm">
            <p className="text-xs font-semibold text-zinc-900">{selected.name}</p>
            <Link href={`/places/${selected.id}`} className="mt-0.5 text-[10px] font-medium text-amber-700">
              View details →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
