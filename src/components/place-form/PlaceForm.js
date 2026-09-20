"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listCategories } from "@/lib/api";
import { toPlacePayload } from "@/lib/placeMedia";
import { PRICE_LEVELS, errorMessage, isHttpUrl } from "@/lib/utils";
import { cardClass, errorBannerClass, inputClass, labelClass, primaryButton, secondaryButton } from "@/lib/styles";
import Spinner from "@/components/ui/Spinner";
import ImageUrlListInput, { MAX_IMAGE_URL_LENGTH } from "./ImageUrlListInput";
import TransportListInput from "./TransportListInput";

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      {children}
    </section>
  );
}

export default function PlaceForm({ initialValues = {}, onSubmit, submitLabel = "Save place", cancelHref = "/places", canManageCategories = false }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [form, setForm] = useState({
    categoryId: initialValues.categoryId ?? "",
    name: initialValues.name ?? "",
    description: initialValues.description ?? "",
    address: initialValues.address ?? "",
    latitude: initialValues.latitude ?? "",
    longitude: initialValues.longitude ?? "",
    openingHours: initialValues.openingHours ?? "",
    priceInfo: initialValues.priceInfo ?? "",
    priceLevel: initialValues.priceLevel ?? "",
    bestTime: initialValues.bestTime ?? "",
    duration: initialValues.duration ?? "",
  });
  const [images, setImages] = useState(
    (initialValues.images ?? []).map((img) => ({ id: img.id, url: img.imageUrl }))
  );
  const [transports, setTransports] = useState(initialValues.transports ?? []);
  const [imageDraft, setImageDraft] = useState("");
  const [transportDraft, setTransportDraft] = useState({ method: "", detail: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoaded(true));
  }, []);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    if (!form.categoryId) return "Choose a category.";
    if (!form.name.trim()) return "Enter a name for this place.";
    const lat = String(form.latitude).trim();
    const lng = String(form.longitude).trim();
    if (lat !== "" && !(Number(lat) >= -90 && Number(lat) <= 90)) return "Latitude must be between -90 and 90.";
    if (lng !== "" && !(Number(lng) >= -180 && Number(lng) <= 180)) return "Longitude must be between -180 and 180.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    let finalImages = images;
    const pendingUrl = imageDraft.trim();
    if (pendingUrl) {
      if (!isHttpUrl(pendingUrl) || pendingUrl.length > MAX_IMAGE_URL_LENGTH) {
        setError(`The URL in the Photos box isn't valid (it must start with http(s):// and be at most ${MAX_IMAGE_URL_LENGTH} characters). Fix or clear it before saving.`);
        return;
      }
      if (!images.some((img) => img.url === pendingUrl)) {
        finalImages = [...images, { url: pendingUrl }];
      }
    }

    let finalTransports = transports;
    const pendingMethod = transportDraft.method.trim();
    const pendingDetail = transportDraft.detail.trim();
    if (pendingMethod || pendingDetail) {
      if (!pendingMethod || !pendingDetail) {
        setError("Fill in both the method and the detail under Getting there, or clear them.");
        return;
      }
      finalTransports = [...transports, { method: pendingMethod, detail: pendingDetail }];
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ values: toPlacePayload(form), images: finalImages, transports: finalTransports });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const noCategories = categoriesLoaded && categories.length === 0;

  return (
    <form onSubmit={handleSubmit} className={`${cardClass} space-y-8 p-6`} noValidate>
      <Section title="Basics">
        <div>
          <label htmlFor="categoryId" className={labelClass}>Category</label>
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={handleChange("categoryId")}
            disabled={!categoriesLoaded || noCategories}
            className={inputClass}
          >
            <option value="">{categoriesLoaded ? "Select a category…" : "Loading categories…"}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {noCategories && (
            <p className="mt-1.5 text-xs text-zinc-400">
              There are no categories yet.{" "}
              {canManageCategories ? (
                <Link href="/dashboard/categories" className="font-medium text-zinc-700 underline">Create one</Link>
              ) : (
                "Ask an admin to create one."
              )}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" value={form.name} onChange={handleChange("name")} placeholder="Wat Pho Temple" className={inputClass} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={handleChange("description")}
            placeholder="What makes this place worth visiting?"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>Address</label>
          <input id="address" value={form.address} onChange={handleChange("address")} placeholder="2 Sanam Chai Rd, Bangkok" className={inputClass} />
        </div>
      </Section>

      <Section title="Visiting details">
        <div>
          <label htmlFor="openingHours" className={labelClass}>Opening hours</label>
          <input id="openingHours" value={form.openingHours} onChange={handleChange("openingHours")} placeholder="8:00 AM – 6:30 PM" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="priceInfo" className={labelClass}>Price</label>
            <input id="priceInfo" value={form.priceInfo} onChange={handleChange("priceInfo")} placeholder="200 THB" className={inputClass} />
          </div>
          <div>
            <label htmlFor="priceLevel" className={labelClass}>Price level</label>
            <select id="priceLevel" value={form.priceLevel} onChange={handleChange("priceLevel")} className={inputClass}>
              <option value="">Not set</option>
              {PRICE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label} {level.hint}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bestTime" className={labelClass}>Best time to visit</label>
            <input id="bestTime" value={form.bestTime} onChange={handleChange("bestTime")} placeholder="Early morning" className={inputClass} />
          </div>
          <div>
            <label htmlFor="duration" className={labelClass}>Suggested duration</label>
            <input id="duration" value={form.duration} onChange={handleChange("duration")} placeholder="1.5 – 2.5 hours" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="latitude" className={labelClass}>Latitude</label>
            <input id="latitude" type="number" step="any" value={form.latitude} onChange={handleChange("latitude")} placeholder="13.7465" className={inputClass} />
          </div>
          <div>
            <label htmlFor="longitude" className={labelClass}>Longitude</label>
            <input id="longitude" type="number" step="any" value={form.longitude} onChange={handleChange("longitude")} placeholder="100.4927" className={inputClass} />
          </div>
        </div>
      </Section>

      <Section title="Photos and transport">
        <ImageUrlListInput images={images} onChange={setImages} draft={imageDraft} onDraftChange={setImageDraft} />
        <TransportListInput transports={transports} onChange={setTransports} draft={transportDraft} onDraftChange={setTransportDraft} />
      </Section>

      {error && <div className={errorBannerClass} role="alert">{error}</div>}

      <div className="flex items-center gap-3 border-t border-zinc-100 pt-6">
        <button type="submit" disabled={submitting || noCategories} className={primaryButton}>
          {submitting && <Spinner />}
          {submitting ? "Saving…" : submitLabel}
        </button>
        <Link href={cancelHref} className={secondaryButton}>Cancel</Link>
      </div>
    </form>
  );
}
