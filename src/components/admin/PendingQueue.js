"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, ImageOff, MapPin, X } from "lucide-react";
import { cardClass, errorBannerClass } from "@/lib/styles";
import { errorMessage, formatMonthYear } from "@/lib/utils";

export default function PendingQueue({ places, onApprove, onReject }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  async function run(action, id) {
    setBusy(id);
    setError("");
    try {
      await action(id);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  }

  if (!places.length) {
    return (
      <div className={`${cardClass} px-6 py-14 text-center text-sm text-zinc-400`}>
        Nothing is waiting for review.
      </div>
    );
  }

  return (
    <div>
      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}
      <div className="space-y-3">
        {places.map((place) => {
          const cover = place.images?.[0]?.imageUrl;
          const disabled = busy === place.id;
          return (
            <div key={place.id} className={`${cardClass} flex flex-wrap items-center gap-4 p-4`}>
              <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
                {cover ? (
                  <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link href={`/places/${place.id}`} className="text-sm font-semibold text-zinc-900 hover:underline">
                  {place.name}
                </Link>
                <p className="text-xs text-zinc-400">
                  {place.category?.name}
                  {place.createdAt && ` — submitted ${formatMonthYear(place.createdAt)}`}
                </p>
                {place.address && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => run(onReject, place.id)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </button>
                <button
                  onClick={() => run(onApprove, place.id)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
