import PlaceCard from "@/components/place/PlaceCard";

export function PlaceGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="h-52 animate-pulse bg-zinc-100 motion-reduce:animate-none" />
          <div className="space-y-2 p-4">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-zinc-100 motion-reduce:animate-none" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PlaceGrid({ places, emptyMessage = "No places match your search." }) {
  if (!places.length) {
    return <div className="py-20 text-center text-sm text-zinc-400">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
