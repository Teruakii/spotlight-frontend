"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageOff, Star } from "lucide-react";
import { listRecommendations } from "@/lib/api";

const REASON_LABEL = {
  "saved-category": "Matches your saved places",
  "top-rated": "Top rated",
};

export default function PickedForYou({ token }) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    let cancelled = false;
    listRecommendations(token, 2)
      .then((data) => {
        if (!cancelled) setPlaces(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!places.length) return null;

  return (
    <div className="mb-10">
      <div className="mb-4">
        <p className="mb-1 text-xs font-medium text-amber-700">Picked for you</p>
        <h2 className="text-xl font-semibold text-zinc-900">Places you might like next</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {places.map((place) => {
          const cover = place.images?.[0]?.imageUrl;
          return (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group flex rounded-xl border border-zinc-200 bg-white p-3 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
                {cover ? <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ImageOff className="h-5 w-5" />}
              </div>
              <div className="min-w-0 p-2.5">
                <span className="text-[10px] font-medium uppercase tracking-wide text-amber-700">
                  {REASON_LABEL[place.reason]}
                </span>
                <p className="mt-1 truncate text-sm font-semibold text-zinc-900">{place.name}</p>
                {place.address && <p className="mt-1 truncate text-xs text-zinc-400">{place.address}</p>}
                <p className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                  {place.rating !== null ? (
                    <>
                      <Star className="h-3 w-3 fill-amber-600 text-amber-600" /> {place.rating}
                    </>
                  ) : (
                    "New"
                  )}
                  {place.category?.name && ` · ${place.category.name}`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
