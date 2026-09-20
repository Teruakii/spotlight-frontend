"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import usePlaceFeed from "@/lib/usePlaceFeed";
import SearchInput from "@/components/home/SearchInput";
import CategoryFilter from "@/components/home/CategoryFilter";
import SortChips from "@/components/home/SortChips";
import PlaceGrid, { PlaceGridSkeleton } from "@/components/home/PlaceGrid";
import { errorBannerClass, primaryButton } from "@/lib/styles";

export default function PlacesPage() {
  const { user } = useAuth();
  const feed = usePlaceFeed();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">All places</h1>
        {user && (
          <Link href="/places/new" className={primaryButton}>
            <Plus className="h-3.5 w-3.5" />
            Add place
          </Link>
        )}
      </div>

      <div className="mb-6 space-y-4">
        <SearchInput value={feed.search} onChange={feed.setSearch} placeholder="Search by name or address…" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CategoryFilter
            categories={feed.categories}
            active={feed.categoryId}
            onChange={feed.setCategoryId}
          />
          <SortChips value={feed.sort} onChange={feed.setSort} />
        </div>
      </div>

      {feed.error && <div className={`${errorBannerClass} mb-6`} role="alert">{feed.error}</div>}

      {feed.loading ? <PlaceGridSkeleton /> : <PlaceGrid places={feed.places} />}
    </main>
  );
}
