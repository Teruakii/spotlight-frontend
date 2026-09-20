"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { listPlaces } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { cardClass, errorBannerClass } from "@/lib/styles";
import StatCard from "@/components/admin/StatCard";

export default function DashboardPage() {
  const { token } = useAuth();
  const [places, setPlaces] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    listPlaces({}, token)
      .then(setPlaces)
      .catch((err) => setError(errorMessage(err)));
  }, [token]);

  const count = (status) => (places ? places.filter((p) => p.status === status).length : null);
  const pending = places ? places.filter((p) => p.status === "pending") : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Overview</h1>
      {error && <div className={`${errorBannerClass} mb-6`} role="alert">{error}</div>}

      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total places" value={places?.length} />
        <StatCard label="Approved" value={count("approved")} />
        <StatCard label="Pending review" value={count("pending")} />
        <StatCard label="Rejected" value={count("rejected")} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">Waiting for review</h2>
        {pending.length > 0 && (
          <Link href="/dashboard/pending" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
            Open queue
          </Link>
        )}
      </div>

      <div className={cardClass}>
        {pending.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-400">Nothing is waiting for review.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {pending.slice(0, 5).map((place) => (
              <li key={place.id} className="flex items-center justify-between px-5 py-3.5">
                <Link href={`/places/${place.id}`} className="text-sm font-medium text-zinc-900 hover:underline">
                  {place.name}
                </Link>
                <span className="text-xs text-zinc-400">{place.category?.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
