"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPlace, updatePlace } from "@/lib/api";
import { takeFlash } from "@/lib/flash";
import { syncPlaceMedia } from "@/lib/placeMedia";
import { errorMessage } from "@/lib/utils";
import PlaceForm from "@/components/place-form/PlaceForm";
import PageMessage from "@/components/ui/PageMessage";

export default function EditPlacePage() {
  const { id } = useParams();
  const { user, token, loading: authLoading, isAdmin, hasPermission } = useAuth();
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [state, setState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const flash = takeFlash();
    if (flash) setNotice(flash);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    getPlace(id, token)
      .then((data) => {
        if (cancelled) return;
        setPlace(data);
        setState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(errorMessage(err));
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, token, user, authLoading, router]);

  if (authLoading || !user || state === "loading") return <PageMessage>Loading…</PageMessage>;
  if (state === "error") return <PageMessage>{loadError}</PageMessage>;

  const canEdit = hasPermission("place:manage_any") || user.id === place.createdBy;
  if (!canEdit) return <PageMessage>You can&apos;t edit this place.</PageMessage>;

  async function handleSubmit({ values, images, transports }) {
    await updatePlace(id, values, token);

    const keptIds = new Set(images.filter((img) => img.id).map((img) => img.id));
    const errors = await syncPlaceMedia({
      placeId: id,
      token,
      removedImageIds: place.images.filter((img) => !keptIds.has(img.id)).map((img) => img.id),
      addedImageUrls: images.filter((img) => !img.id).map((img) => img.url),
      newTransports: transports.filter((t) => !t.id),
    });

    if (errors.length > 0) {
      const fresh = await getPlace(id, token);
      setPlace(fresh);
      setFormKey((k) => k + 1);
      setNotice(
        `Your changes were saved, but ${errors.length} photo or transport ${errors.length === 1 ? "change" : "changes"} couldn't be applied (${errors[0]}). The form now shows what is saved.`
      );
      return;
    }
    router.push(`/places/${id}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Edit place</h1>
      <p className="mb-6 text-sm text-zinc-400">
        {isAdmin
          ? "Admin edits take effect immediately."
          : "Editing an approved place sends it back to pending for re-approval."}
      </p>
      {notice && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700" role="status">
          {notice}
        </div>
      )}
      <PlaceForm
        key={formKey}
        initialValues={place}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        cancelHref={`/places/${id}`}
        canManageCategories={isAdmin}
      />
    </main>
  );
}
