"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createPlace } from "@/lib/api";
import { setFlash } from "@/lib/flash";
import { syncPlaceMedia } from "@/lib/placeMedia";
import PlaceForm from "@/components/place-form/PlaceForm";
import PageMessage from "@/components/ui/PageMessage";

export default function NewPlacePage() {
  const { user, token, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <PageMessage>Loading…</PageMessage>;

  async function handleSubmit({ values, images, transports }) {
    const place = await createPlace(values, token);
    const errors = await syncPlaceMedia({
      placeId: place.id,
      token,
      addedImageUrls: images.map((img) => img.url),
      newTransports: transports,
    });

    if (errors.length > 0) {
      setFlash(
        `Your place was created, but ${errors.length} photo or transport ${errors.length === 1 ? "entry" : "entries"} couldn't be saved (${errors[0]}). Add ${errors.length === 1 ? "it" : "them"} again below.`
      );
      router.push(`/places/${place.id}/edit`);
      return;
    }
    router.push(`/places/${place.id}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Add a place</h1>
      <p className="mb-6 text-sm text-zinc-400">
        New places stay pending until an admin approves them.
      </p>
      <PlaceForm onSubmit={handleSubmit} submitLabel="Submit place" canManageCategories={isAdmin} />
    </main>
  );
}
