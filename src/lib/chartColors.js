// Categorical chart colours, in fixed order. Validated with the dataviz
// palette checker (light surface): lightness band, chroma, CVD and
// normal-vision separation all pass. Slots 3 and 5 are below 3:1 against the
// surface, so every chart using them shows values in a visible legend.
// Slot 2 is the brand amber.
export const SERIES_COLORS = ["#2a78d6", "#D97706", "#1baf7a", "#6250d6", "#e87ba4"];

// Neutral for the folded "Other" bucket (never a generated sixth hue).
export const OTHER_COLOR = "#A1A1AA";
