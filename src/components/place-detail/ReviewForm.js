"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import ImageUrlListInput from "@/components/place-form/ImageUrlListInput";
import { errorMessage, fullName } from "@/lib/utils";
import { MAX_REVIEW_PHOTOS, SUB_RATINGS } from "@/lib/reviews";
import { errorBannerClass, primaryButton } from "@/lib/styles";

const MAX_LENGTH = 2000;
const REVIEW_IMAGE_URL_MAX = 500;
const EMPTY_SUB_RATINGS = Object.fromEntries(SUB_RATINGS.map(({ field }) => [field, 0]));

export default function ReviewForm({ user, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [subRatings, setSubRatings] = useState(EMPTY_SUB_RATINGS);
  const [images, setImages] = useState([]);
  const [imageDraft, setImageDraft] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [posted, setPosted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    setError("");
    setPosted(false);
    const scored = Object.fromEntries(Object.entries(subRatings).filter(([, value]) => value > 0));
    try {
      await onSubmit({
        rating,
        comment: comment.trim() || undefined,
        ...scored,
        imageUrls: images.map((img) => img.url),
      });
      setRating(0);
      setComment("");
      setSubRatings(EMPTY_SUB_RATINGS);
      setImages([]);
      setImageDraft("");
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

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        aria-expanded={showDetails}
        className="mb-4 flex w-full items-center justify-between text-xs font-medium text-zinc-500 hover:text-zinc-800"
      >
        Rate details &amp; add photos (optional)
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`} />
      </button>

      {showDetails && (
        <div className="mb-4 space-y-4">
          <div className="space-y-2">
            {SUB_RATINGS.map(({ field, label }) => (
              <div key={field} className="flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-500">{label}</span>
                <StarRating
                  value={subRatings[field]}
                  interactive
                  size="sm"
                  onChange={(value) => setSubRatings((current) => ({ ...current, [field]: value }))}
                />
              </div>
            ))}
          </div>
          <ImageUrlListInput
            images={images}
            onChange={setImages}
            draft={imageDraft}
            onDraftChange={setImageDraft}
            maxLength={REVIEW_IMAGE_URL_MAX}
            maxCount={MAX_REVIEW_PHOTOS}
          />
        </div>
      )}

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
