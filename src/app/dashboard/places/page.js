"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listPlaces, deletePlace } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass } from "@/lib/styles";
import PlacesTable from "@/components/admin/PlacesTable";
import PageMessage from "@/components/ui/PageMessage";

export default function DashboardPlacesPage() {
  const { token } = useAuth();
  const [places, setPlaces] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    listPlaces({}, token)
      .then(setPlaces)
      .catch((err) => setError(errorMessage(err)));
  }, [token]);

  async function handleDelete(id) {
    await deletePlace(id, token);
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">All places</h1>
      {error && <div className={errorBannerClass} role="alert">{error}</div>}
      {!places && !error && <PageMessage>Loading…</PageMessage>}
      {places && <PlacesTable places={places} onDelete={handleDelete} />}
    </div>
  );
}
