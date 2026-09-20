"use client";
import { useState } from "react";
import { Star } from "lucide-react";

const SIZES = { sm: "h-3.5 w-3.5", base: "h-4 w-4", lg: "h-6 w-6" };

export default function StarRating({ value = 0, interactive = false, onChange, size = "base" }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex gap-0.5" role={interactive ? "radiogroup" : "img"} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
        >
          <Star
            className={SIZES[size]}
            fill={star <= active ? "#D97706" : "none"}
            stroke={star <= active ? "#D97706" : "#D4D4D8"}
          />
        </button>
      ))}
    </div>
  );
}
