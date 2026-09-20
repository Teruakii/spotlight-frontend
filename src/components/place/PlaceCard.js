import Link from "next/link";
import { Star, MapPin, ImageOff } from "lucide-react";
import { priceLevelSymbol } from "@/lib/utils";

export default function PlaceCard({ place }) {
  const cover = place.images?.[0]?.imageUrl;
  const price = priceLevelSymbol(place.priceLevel);

  return (
    <Link
      href={`/places/${place.id}`}
      className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-all hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="relative h-52 overflow-hidden bg-zinc-100">
        {cover ? (
          <img
            src={cover}
            alt={place.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        {place.category?.name && (
          <span className="absolute left-3 top-3 rounded-full border border-zinc-200 bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm">
            {place.category.name}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-zinc-900">{place.name}</h3>
          <div className="mt-0.5 flex shrink-0 items-center gap-1">
            {place.rating !== null && place.rating !== undefined ? (
              <>
                <Star className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
                <span className="text-sm font-medium text-zinc-900">{place.rating}</span>
              </>
            ) : (
              <span className="text-xs text-zinc-400">New</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
          {place.address ? (
            <p className="flex min-w-0 items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{place.address}</span>
            </p>
          ) : (
            <span />
          )}
          {price && <span className="shrink-0 text-zinc-500">{price}</span>}
        </div>
      </div>
    </Link>
  );
}
