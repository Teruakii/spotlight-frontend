"use client";
import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import { errorMessage, fullName } from "@/lib/utils";
import { errorBannerClass, primaryButton } from "@/lib/styles";

const MAX_LENGTH = 2000;

export default function ReviewForm({ user, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [posted, setPosted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    setError("");
    setPosted(false);
    try {
      await onSubmit({ rating, comment: comment.trim() || undefined });
      setRating(0);
      setComment("");
      setPosted(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 flex items-center gap-2">
        <Avatar person={user} size="sm" />
        <div>
          <p className="text-xs font-semibold text-zinc-900">{fullName(user)}</p>
          <p className="text-xs text-zinc-400">Writing a review</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs text-zinc-400">Your rating</p>
        <StarRating value={rating} interactive onChange={setRating} size="lg" />
      </div>

      <div className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Share your experience…"
          rows={5}
          aria-label="Your review"
          className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
        />
        <p className="mt-1 text-right text-xs text-zinc-300">
          {comment.length}/{MAX_LENGTH}
        </p>
      </div>

      {error && <div className={`${errorBannerClass} mb-3`} role="alert">{error}</div>}
      {posted && (
        <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700" role="status">
          Your review has been posted.
        </div>
      )}

      <button type="submit" disabled={!rating || submitting} className={`${primaryButton} w-full`}>
        {submitting && <Spinner />}
        Post review
      </button>
    </form>
  );
}
