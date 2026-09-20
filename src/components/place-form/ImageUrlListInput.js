"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { isHttpUrl } from "@/lib/utils";
import { inputClass, labelClass, secondaryButton } from "@/lib/styles";

export const MAX_IMAGE_URL_LENGTH = 191;

export default function ImageUrlListInput({ images, onChange, draft, onDraftChange }) {
  const [error, setError] = useState("");

  function addImage() {
    const url = draft.trim();
    if (!url) return;
    if (!isHttpUrl(url)) {
      setError("Enter a full image URL starting with http:// or https://");
      return;
    }
    if (url.length > MAX_IMAGE_URL_LENGTH) {
      setError(`This URL is too long (max ${MAX_IMAGE_URL_LENGTH} characters). Use a shorter link.`);
      return;
    }
    if (images.some((img) => img.url === url)) {
      setError("This image is already in the list.");
      return;
    }
    onChange([...images, { url }]);
    onDraftChange("");
    setError("");
  }

  function removeImage(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label htmlFor="image-url" className={labelClass}>Photos</label>
      <div className="mb-2 flex gap-2">
        <input
          id="image-url"
          value={draft}
          onChange={(e) => {
            onDraftChange(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addImage();
            }
          }}
          placeholder="Paste an image URL and press Enter"
          className={inputClass}
        />
        <button type="button" onClick={addImage} aria-label="Add image" className={`${secondaryButton} shrink-0 rounded-xl px-3`}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

      {images.length > 0 && (
        <ul className="space-y-2">
          {images.map((img, i) => (
            <li
              key={img.id ?? img.url}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-2"
            >
              <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">{img.url}</span>
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove image"
                className="p-1 text-zinc-400 transition-colors hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
