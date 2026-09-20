import { useEffect, useMemo, useState } from "react";
import { listCategories, listPlaces } from "@/lib/api";
import { errorMessage } from "@/lib/utils";

export default function usePlaceFeed() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    listPlaces({ categoryId: categoryId ?? undefined, status: "approved" })
      .then((data) => {
        if (!cancelled) setPlaces(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setPlaces([]);
          setError(errorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? places.filter(
          (p) => p.name.toLowerCase().includes(query) || p.address?.toLowerCase().includes(query)
        )
      : places;
    if (sort === "top") {
      return [...filtered].sort(
        (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || b.reviewCount - a.reviewCount
      );
    }
    return filtered;
  }, [places, search, sort]);

  return {
    categories,
    categoryId,
    setCategoryId,
    search,
    setSearch,
    sort,
    setSort,
    places: visible,
    loading,
    error,
  };
}
