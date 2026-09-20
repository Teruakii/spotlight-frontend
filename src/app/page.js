"use client";
import HeroSearch from "@/components/home/HeroSearch";
import CategoryFilter from "@/components/home/CategoryFilter";
import SortChips from "@/components/home/SortChips";
import PlaceGrid, { PlaceGridSkeleton } from "@/components/home/PlaceGrid";
import usePlaceFeed from "@/lib/usePlaceFeed";
import { errorBannerClass } from "@/lib/styles";

export default function DiscoverPage() {
  const feed = usePlaceFeed();

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
        <div className="mb-8">
          <SortChips value={feed.sort} onChange={feed.setSort} />
        </div>

        {feed.error && <div className={`${errorBannerClass} mb-6`} role="alert">{feed.error}</div>}

        {feed.loading ? (
          <PlaceGridSkeleton />
        ) : (
          <PlaceGrid
            places={feed.places}
            emptyMessage={feed.search ? "No places match your search." : "No places here yet."}
          />
        )}
      </section>
    </main>
  );
}
