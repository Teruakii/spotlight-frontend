"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listReportedReviews, moderateReview } from "@/lib/api";
import { errorMessage, formatMonthYear, fullName } from "@/lib/utils";
import { cardClass, errorBannerClass } from "@/lib/styles";
import StarRating from "@/components/ui/StarRating";
import PageMessage from "@/components/ui/PageMessage";

const REASON_LABEL = { spam: "Spam", offensive: "Offensive", misleading: "Misleading", other: "Other" };

export default function ReportedReviewsPage() {
  const { token } = useAuth();
  const [queue, setQueue] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    listReportedReviews(token)
      .then(setQueue)
      .catch((err) => {
        setQueue([]);
        setError(errorMessage(err));
      });
  }, [token]);

  async function act(group, action) {
    if (action === "remove" && !window.confirm("Delete this review permanently?")) return;
    setBusyId(group.review.id);
    setError("");
    try {
      await moderateReview(group.review.id, action, token);
      setQueue((q) => q.filter((g) => g.review.id !== group.review.id));
      setMessage(
        action === "remove"
          ? `Review on ${group.review.place.name} was removed.`
          : `Reports on ${group.review.place.name} were dismissed.`
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-zinc-900">Moderation queue</h1>
        <p className="mt-1 text-xs text-zinc-400">
          {queue === null ? "Loading…" : `${queue.length} reported review${queue.length === 1 ? "" : "s"} need attention`}
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700" role="status">
          {message}
        </div>
      )}
      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}

      {queue === null ? (
        <PageMessage>Loading reports…</PageMessage>
      ) : queue.length === 0 ? (
        <div className={`${cardClass} py-14 text-center`}>
          <p className="text-sm font-medium text-zinc-700">Queue cleared</p>
          <p className="mt-1 text-xs text-zinc-400">There are no reported reviews waiting.</p>
        </div>
      ) : (
        <div className={`${cardClass} overflow-hidden`}>
          {queue.map((group) => (
            <div
              key={group.review.id}
              className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-4 last:border-none md:flex-row md:items-start"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Link href={`/places/${group.review.place.id}`} className="text-sm font-semibold text-zinc-900 hover:underline">
                    {group.review.place.name}
                  </Link>
                  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] text-zinc-400">
                    Reported by {group.reportCount} user{group.reportCount === 1 ? "" : "s"}
                  </span>
                  {Object.entries(group.reasons).map(([reason, count]) => (
                    <span key={reason} className="text-[10px] font-medium text-amber-700">
                      {REASON_LABEL[reason]}
                      {count > 1 && ` ×${count}`}
                    </span>
                  ))}
                </div>
                <div className="mb-1 flex items-center gap-2 text-xs text-zinc-400">
                  <StarRating value={group.review.rating} size="sm" />
                  {fullName(group.review.author)} · {formatMonthYear(group.review.createdAt)}
                </div>
                {group.review.comment && (
                  <p className="line-clamp-3 text-sm text-zinc-600">{group.review.comment}</p>
                )}
                {group.details.length > 0 && (
                  <p className="mt-1 text-xs italic text-zinc-400">“{group.details.join("” · “")}”</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => act(group, "dismiss")}
                  disabled={busyId === group.review.id}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-500 hover:border-zinc-400 disabled:opacity-60"
                >
                  Keep review
                </button>
                <button
                  onClick={() => act(group, "remove")}
                  disabled={busyId === group.review.id}
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  Remove review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
