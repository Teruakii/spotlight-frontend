"use client";
import { useState } from "react";
import HeroSearch from "@/components/home/HeroSearch";
import CategoryFilter from "@/components/home/CategoryFilter";
import SortChips from "@/components/home/SortChips";
import PlaceGrid, { PlaceGridSkeleton } from "@/components/home/PlaceGrid";
import PlaceMapView from "@/components/home/PlaceMapView";
import PickedForYou from "@/components/home/PickedForYou";
import { useAuth } from "@/context/AuthContext";
import usePlaceFeed from "@/lib/usePlaceFeed";
import { errorBannerClass } from "@/lib/styles";

const VIEW_MODES = ["grid", "map"];

export default function DiscoverPage() {
  const { token } = useAuth();
  const feed = usePlaceFeed();
  const [viewMode, setViewMode] = useState("grid");

  const emptyMessage =
    feed.sort === "nearby"
      ? `No places within ${feed.nearbyRadiusKm} km of you.`
      : feed.search
        ? "No places match your search."
        : "No places here yet.";

  return (
    <main>
      <HeroSearch value={feed.search} onChange={feed.setSearch}>
        <CategoryFilter
          categories={feed.categories}
          active={feed.categoryId}
          onChange={feed.setCategoryId}
        />
      </HeroSearch>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {token && <PickedForYou token={token} />}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SortChips value={feed.sort} onChange={feed.setSort} />
          <div className="flex items-center self-start rounded-lg border border-zinc-200 bg-white p-1">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  viewMode === mode ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {feed.error && <div className={`${errorBannerClass} mb-6`} role="alert">{feed.error}</div>}

        {feed.loading ? (
          <PlaceGridSkeleton />
        ) : viewMode === "map" ? (
          <PlaceMapView places={feed.places} />
        ) : (
          <PlaceGrid places={feed.places} emptyMessage={emptyMessage} />
        )}
      </section>
    </main>
  );
}
