import { addPlaceImage, deletePlaceImage, addPlaceTransport } from "@/lib/api";
import { errorMessage } from "@/lib/utils";

export async function syncPlaceMedia({ placeId, token, removedImageIds = [], addedImageUrls = [], newTransports = [] }) {
  const jobs = [
    ...removedImageIds.map((imageId) => () => deletePlaceImage(placeId, imageId, token)),
    ...addedImageUrls.map((url) => () => addPlaceImage(placeId, url, token)),
    ...newTransports.map((t) => () => addPlaceTransport(placeId, { method: t.method, detail: t.detail }, token)),
  ];

  const errors = [];
  for (const job of jobs) {
    try {
      await job();
    } catch (err) {
      console.error("Saving photo/transport failed:", err);
      errors.push(errorMessage(err));
    }
  }
  return errors;
}

export function toPlacePayload(form) {
  const text = (value) => {
    const trimmed = String(value ?? "").trim();
    return trimmed === "" ? null : trimmed;
  };
  const number = (value) => (String(value ?? "").trim() === "" ? null : Number(value));

  return {
    categoryId: Number(form.categoryId),
    name: String(form.name).trim(),
    description: text(form.description),
    address: text(form.address),
    latitude: number(form.latitude),
    longitude: number(form.longitude),
    openingHours: text(form.openingHours),
    priceInfo: text(form.priceInfo),
    priceLevel: number(form.priceLevel),
    bestTime: text(form.bestTime),
    duration: text(form.duration),
  };
}
