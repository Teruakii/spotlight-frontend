// The optional per-aspect scores a review can carry. `key` matches the
// `subRatings` object on detailed reviews; `field` is the create payload name.
export const SUB_RATINGS = [
  { key: "experience", field: "experienceRating", label: "Experience" },
  { key: "value", field: "valueRating", label: "Value" },
  { key: "access", field: "accessRating", label: "Access" },
  { key: "atmosphere", field: "atmosphereRating", label: "Atmosphere" },
];

export const MAX_REVIEW_PHOTOS = 4;

// Average of each aspect across the reviews that scored it; null when none did.
export function subRatingAverages(reviews) {
  return SUB_RATINGS.map(({ key, label }) => {
    const scores = reviews.map((r) => r.subRatings?.[key]).filter((v) => v !== null && v !== undefined);
    const average = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null;
    return { key, label, average };
  });
}
