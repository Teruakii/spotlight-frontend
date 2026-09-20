export function fullName(user) {
  if (!user) return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ");
}

export function initials(person) {
  if (!person) return "?";
  const first = person.firstName?.[0] ?? "";
  const last = person.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

export function formatMonthYear(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const PRICE_LEVELS = [
  { value: 1, label: "฿", hint: "Budget" },
  { value: 2, label: "฿฿", hint: "Moderate" },
  { value: 3, label: "฿฿฿", hint: "Upscale" },
  { value: 4, label: "฿฿฿฿", hint: "Luxury" },
];

export function priceLevelSymbol(level) {
  return level ? "฿".repeat(level) : "";
}

export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (Array.isArray(err?.details) && err.details.length) {
    return err.details.map((d) => d.message).join(", ");
  }
  return err?.message || fallback;
}

export function averageRating(reviews) {
  if (!reviews.length) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
