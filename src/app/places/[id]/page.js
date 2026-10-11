"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Pencil, Star, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getPlace,
  listDetailedReviews,
  createDetailedReview,
  deleteReview,
  markReviewHelpful,
  unmarkReviewHelpful,
  listCategories,
  recordPlaceView,
} from "@/lib/api";
import { averageRating, errorMessage, findDiningCategory } from "@/lib/utils";
import { cardClass, errorBannerClass, primaryButton, secondaryButton } from "@/lib/styles";

import ImageGallery from "@/components/place-detail/ImageGallery";
import PlaceDetails from "@/components/place-detail/PlaceDetails";
import TransportList from "@/components/place-detail/TransportList";
import ReviewSummary from "@/components/place-detail/ReviewSummary";
import ReviewList from "@/components/place-detail/ReviewList";
import ReviewForm from "@/components/place-detail/ReviewForm";
import SaveButton from "@/components/place-detail/SaveButton";
import NearbyEats from "@/components/place-detail/NearbyEats";
import StatusBadge from "@/components/ui/StatusBadge";
import Tabs from "@/components/ui/Tabs";
import PageMessage from "@/components/ui/PageMessage";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { user, token, loading: authLoading, hasPermission } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [state, setState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("about");
  const [diningCategory, setDiningCategory] = useState(null);
  const viewRecordedFor = useRef(null);

  // One visit per page load; the ref stops StrictMode's double effect counting twice.
  useEffect(() => {
    if (authLoading || viewRecordedFor.current === id) return;
    viewRecordedFor.current = id;
    recordPlaceView(id, token).catch(() => {});
  }, [id, token, authLoading]);

  useEffect(() => {
    listCategories()
      .then((categories) => setDiningCategory(findDiningCategory(categories)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setState("loading");
    Promise.all([getPlace(id, token), listDetailedReviews(id, token).catch(() => [])])
      .then(([loadedPlace, loadedReviews]) => {
        if (cancelled) return;
        setPlace(loadedPlace);
        setReviews(loadedReviews);
        setState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(errorMessage(err));
        setState(err.status === 404 ? "notfound" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, token, authLoading]);

  if (state === "loading") return <PageMessage>Loading place…</PageMessage>;
  if (state === "notfound") {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-sm text-zinc-400">This place doesn&apos;t exist or isn&apos;t published yet.</p>
        <Link href="/places" className={secondaryButton}>Browse places</Link>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="mx-auto max-w-md py-20">
        <div className={errorBannerClass} role="alert">{loadError}</div>
      </div>
    );
  }

  const isApproved = place.status === "approved";
  const canEdit = Boolean(user) && (hasPermission("place:manage_any") || user.id === place.createdBy);
  const average = averageRating(reviews);
  const hasCoordinates = place.latitude !== null && place.longitude !== null;

  async function handleAddReview(input) {
    const review = await createDetailedReview(id, input, token);
    setReviews((prev) => [review, ...prev]);
  }

  async function handleToggleHelpful(review) {
    const helpful = !review.helpfulByMe;
    await (helpful ? markReviewHelpful(review.id, token) : unmarkReviewHelpful(review.id, token));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? { ...r, helpfulByMe: helpful, helpfulCount: r.helpfulCount + (helpful ? 1 : -1) }
          : r
      )
    );
  }

  function canVote(review) {
    return Boolean(user) && user.id !== review.userId;
  }

  async function handleDeleteReview(reviewId) {
    await deleteReview(reviewId, token);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }

  function canDeleteReview(review) {
    return Boolean(user) && (user.id === review.userId || hasPermission("review:manage_any"));
  }

  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 pb-2 pt-6">
        <Link
          href="/places"
          className="flex w-fit items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-600"
        >
          <ChevronLeft className="h-3 w-3" />
          Back to places
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <ImageGallery images={place.images} alt={place.name} />

        {!isApproved && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {place.status === "pending"
              ? "This place is waiting for admin approval. Only you and admins can see it."
              : "This place was rejected. Only you and admins can see it."}
          </div>
        )}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {place.category?.name && (
                <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500">
                  {place.category.name}
                </span>
              )}
              {!isApproved && <StatusBadge status={place.status} />}
              {average !== null && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
                  <span className="text-sm font-semibold text-zinc-900">{average.toFixed(1)}</span>
                  <span className="text-xs text-zinc-400">
                    ({reviews.length} review{reviews.length === 1 ? "" : "s"})
                  </span>
                </div>
              )}
            </div>
            <h1 className="mb-1 text-2xl font-semibold text-zinc-900 md:text-3xl">{place.name}</h1>
            {place.address && (
              <p className="flex items-center gap-1 text-sm text-zinc-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {place.address}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {canEdit && (
              <Link href={`/places/${id}/edit`} className={secondaryButton}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            )}
            {user && isApproved && <SaveButton placeId={place.id} token={token} />}
          </div>
        </div>

        <Tabs
          tabs={[
            { key: "about", label: "About" },
            ...(hasCoordinates && isApproved
              ? [{ key: "nearby", label: diningCategory ? "Nearby Eats" : "Nearby" }]
              : []),
            { key: "reviews", label: "Reviews", count: reviews.length },
          ]}
          active={tab}
          onChange={setTab}
        />

        <div className="mt-8">
          {tab === "about" && (
            <div className="grid gap-10 md:grid-cols-3">
              <div className="md:col-span-2">
                <h2 className="mb-3 text-base font-semibold text-zinc-900">Overview</h2>
                {place.description ? (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">{place.description}</p>
                ) : (
                  <p className="text-sm text-zinc-400">No description yet.</p>
                )}
                <PlaceDetails place={place} />
              </div>
              <div>
                <h2 className="mb-3 text-base font-semibold text-zinc-900">Getting there</h2>
                <TransportList transports={place.transports} />
                {hasCoordinates && (
                  <a
                    href={`https://www.google.com/maps?q=${Number(place.latitude)},${Number(place.longitude)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${secondaryButton} mt-5`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Open in Maps
                  </a>
                )}
              </div>
            </div>
          )}

          {tab === "nearby" && <NearbyEats placeId={place.id} diningCategory={diningCategory} />}

          {tab === "reviews" && (
            <div className="grid gap-10 md:grid-cols-3">
              <div className="md:col-span-2">
                <ReviewSummary reviews={reviews} average={average} />
                <ReviewList
                  reviews={reviews}
                  canDelete={canDeleteReview}
                  onDelete={handleDeleteReview}
                  canVote={canVote}
                  onToggleHelpful={handleToggleHelpful}
                  token={token}
                />
              </div>

              <div>
                <div className={`${cardClass} sticky top-24 p-5`}>
                  {!isApproved ? (
                    <p className="py-4 text-center text-sm text-zinc-400">
                      Reviews open once this place is approved.
                    </p>
                  ) : user ? (
                    <ReviewForm user={user} onSubmit={handleAddReview} />
                  ) : (
                    <div className="py-4 text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                        <User className="h-5 w-5 text-zinc-400" />
                      </div>
                      <p className="mb-1 text-sm font-medium text-zinc-900">Sign in to review</p>
                      <p className="mb-4 text-xs text-zinc-400">Share your experience with this place.</p>
                      <Link href="/login" className={`${primaryButton} w-full`}>Sign In</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
