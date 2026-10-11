import Link from "next/link";
import { Star } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { formatMonthYear } from "@/lib/utils";

export default function MyReviewsList({ reviews }) {
  if (!reviews.length) {
    return (
      <div className="py-16 text-center text-zinc-400">
        <Star className="mx-auto mb-3 h-10 w-10 text-zinc-200" strokeWidth={1.5} />
        <p className="text-sm">No reviews yet. Visit a place and share your experience!</p>
        <Link
          href="/places"
          className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800"
        >
          Find a place
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/places/${review.place.id}`}
          className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300"
        >
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
            {review.place.imageUrl && (
              <img src={review.place.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-zinc-900">{review.place.name}</p>
              <span className="shrink-0 text-xs text-zinc-400">{formatMonthYear(review.createdAt)}</span>
            </div>
            <div className="mb-2">
              <StarRating value={review.rating} size="sm" />
            </div>
            {review.comment && <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">{review.comment}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
