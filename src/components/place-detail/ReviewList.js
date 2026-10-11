"use client";
import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import Avatar from "@/components/ui/Avatar";
import { errorMessage, formatMonthYear, fullName } from "@/lib/utils";
import { errorBannerClass } from "@/lib/styles";

const FILTERS = [
  { key: "all", label: "All", matches: () => true },
  { key: "five", label: "5 star", matches: (review) => review.rating === 5 },
];

export default function ReviewList({ reviews, canDelete, onDelete }) {
  const [filter, setFilter] = useState("all");
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function handleDelete(id) {
    setBusyId(id);
    setError("");
    try {
      await onDelete(id);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
      setConfirmingId(null);
    }
  }

  if (!reviews.length) return null;

  const visible = reviews.filter(FILTERS.find((f) => f.key === filter).matches);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.key
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto whitespace-nowrap text-xs text-zinc-400">
          {visible.length} result{visible.length === 1 ? "" : "s"}
        </span>
      </div>

      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}
      <div className="space-y-6">
        {visible.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-400">No reviews match this filter.</p>
        )}
        {visible.map((review) => (
          <div key={review.id} className="border-b border-zinc-100 pb-6 last:border-none">
            <div className="mb-2 flex items-center gap-3">
              <Avatar person={review.author} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900">{fullName(review.author) || "Traveler"}</p>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-xs text-zinc-400">{formatMonthYear(review.createdAt)}</span>
                </div>
              </div>
              {canDelete(review) &&
                (confirmingId === review.id ? (
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={busyId === review.id}
                      className="font-medium text-red-500 hover:text-red-600 disabled:opacity-60"
                    >
                      {busyId === review.id ? "Deleting…" : "Confirm delete"}
                    </button>
                    <button onClick={() => setConfirmingId(null)} className="text-zinc-400 hover:text-zinc-600">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(review.id)}
                    className="text-xs text-zinc-400 transition-colors hover:text-red-500"
                  >
                    Delete
                  </button>
                ))}
            </div>
            {review.comment && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
