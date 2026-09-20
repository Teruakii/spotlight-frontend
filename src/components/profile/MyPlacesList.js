import Link from "next/link";
import { ImageOff, Pencil } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { cardClass } from "@/lib/styles";

export default function MyPlacesList({ places }) {
  if (!places.length) {
    return (
      <div className={`${cardClass} px-6 py-14 text-center`}>
        <p className="mb-4 text-sm text-zinc-400">You haven&apos;t added any places yet.</p>
        <Link
          href="/places/new"
          className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800"
        >
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {places.map((place) => {
        const cover = place.images?.[0]?.imageUrl;
        return (
          <div
            key={place.id}
            className={`${cardClass} flex items-center gap-4 p-4 transition-colors hover:border-zinc-300`}
          >
            <Link href={`/places/${place.id}`} className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
                {cover ? (
                  <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{place.name}</p>
                <p className="text-xs text-zinc-400">{place.category?.name}</p>
              </div>
            </Link>
            <StatusBadge status={place.status} />
            <Link
              href={`/places/${place.id}/edit`}
              aria-label={`Edit ${place.name}`}
              className="p-1.5 text-zinc-400 transition-colors hover:text-zinc-800"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
