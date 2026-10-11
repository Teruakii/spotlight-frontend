"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageOff, Star } from "lucide-react";
import { listPlacesNear } from "@/lib/api";
import { errorMessage, formatDistance } from "@/lib/utils";
import { errorBannerClass } from "@/lib/styles";
import PageMessage from "@/components/ui/PageMessage";

const RADIUS_KM = 5;
const LIMIT = 8;

// One request per food category (or one unfiltered request when the site has
// none), merged and re-sorted by distance.
function loadNearby(placeId, categories) {
  const categoryIds = categories.length ? categories.map((c) => c.id) : [undefined];
  return Promise.all(
    categoryIds.map((categoryId) => listPlacesNear(placeId, { categoryId, radiusKm: RADIUS_KM, limit: LIMIT }))
  ).then((lists) => lists.flat().sort((a, b) => a.distanceKm - b.distanceKm).slice(0, LIMIT));
}

export default function NearbyEats({ placeId, diningCategories }) {
  const [places, setPlaces] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadNearby(placeId, diningCategories)
      .then((data) => {
        if (!cancelled) setPlaces(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setPlaces([]);
          setError(errorMessage(err));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [placeId, diningCategories]);

  if (error) return <div className={errorBannerClass} role="alert">{error}</div>;
  if (places === null) return <PageMessage>Finding places nearby…</PageMessage>;
  if (places.length === 0) {
    return <PageMessage>Nothing within {RADIUS_KM} km yet.</PageMessage>;
  }

  return (
    <div className="space-y-3">
      {places.map((place) => {
        const cover = place.images?.[0]?.imageUrl;
        return (
          <Link
            key={place.id}
            href={`/places/${place.id}`}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
              {cover ? (
                <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 truncate text-sm font-semibold text-zinc-900">{place.name}</p>
              <p className="flex items-center gap-1 text-xs text-zinc-400">
                {place.category?.name}
                {place.rating !== null && (
                  <>
                    <span aria-hidden="true">·</span>
                    <Star className="h-3 w-3 fill-amber-600 text-amber-600" />
                    {place.rating}
                  </>
                )}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium text-zinc-600">{formatDistance(place.distanceKm)}</p>
              <p className="text-xs text-zinc-400">away</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
