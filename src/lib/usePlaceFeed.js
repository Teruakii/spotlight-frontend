import { useEffect, useMemo, useState } from "react";
import { listCategories, listNearbyPlaces, listPlaces } from "@/lib/api";
import { errorMessage } from "@/lib/utils";

const NEARBY_RADIUS_KM = 25;

const SORTS = {
  top: (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || b.reviewCount - a.reviewCount,
  popular: (a, b) => b.reviewCount - a.reviewCount || (b.rating ?? -1) - (a.rating ?? -1),
  // Nearby results arrive ordered by distance; newest arrive ordered by creation.
  nearby: null,
  newest: null,
};

// The browser's position, requested only once the user picks "Nearby".
function useGeolocation(wanted) {
  const [location, setLocation] = useState({ status: "idle", coords: null, message: "" });

  useEffect(() => {
    if (!wanted || location.status !== "idle") return;
    if (!("geolocation" in navigator)) {
      setLocation({ status: "error", coords: null, message: "Your browser can't share its location." });
      return;
    }
    setLocation({ status: "locating", coords: null, message: "" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          status: "ready",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          message: "",
        }),
      () =>
        setLocation({
          status: "error",
          coords: null,
          message: "Allow location access to see places near you.",
        }),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, [wanted, location.status]);

  return location;
}

export default function usePlaceFeed() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const location = useGeolocation(sort === "nearby");
  const nearbyCoords = sort === "nearby" ? location.coords : null;

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (sort === "nearby" && !nearbyCoords) {
      setPlaces([]);
      setLoading(location.status === "locating" || location.status === "idle");
      setError(location.status === "error" ? location.message : "");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    const fetchPlaces = nearbyCoords
      ? listNearbyPlaces({ ...nearbyCoords, radiusKm: NEARBY_RADIUS_KM, categoryId: categoryId ?? undefined, limit: 50 })
      : listPlaces({ categoryId: categoryId ?? undefined, status: "approved" });
    fetchPlaces
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
  }, [categoryId, sort, nearbyCoords, location.status, location.message]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? places.filter(
          (p) => p.name.toLowerCase().includes(query) || p.address?.toLowerCase().includes(query)
        )
      : places;
    const compare = SORTS[sort];
    return compare ? [...filtered].sort(compare) : filtered;
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
    nearbyRadiusKm: NEARBY_RADIUS_KM,
  };
}
