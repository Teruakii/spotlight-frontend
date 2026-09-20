"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listPendingPlaces, approvePlace, rejectPlace } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass } from "@/lib/styles";
import PendingQueue from "@/components/admin/PendingQueue";
import PageMessage from "@/components/ui/PageMessage";

export default function DashboardPendingPage() {
  const { token } = useAuth();
  const [places, setPlaces] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    listPendingPlaces(token)
      .then(setPlaces)
      .catch((err) => setError(errorMessage(err)));
  }, [token]);

  async function handleApprove(id) {
    await approvePlace(id, token);
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleReject(id) {
    await rejectPlace(id, token);
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Pending review</h1>
      {error && <div className={errorBannerClass} role="alert">{error}</div>}
      {!places && !error && <PageMessage>Loading…</PageMessage>}
      {places && <PendingQueue places={places} onApprove={handleApprove} onReject={handleReject} />}
    </div>
  );
}
