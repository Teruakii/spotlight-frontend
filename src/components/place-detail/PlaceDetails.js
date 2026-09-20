import { PRICE_LEVELS, priceLevelSymbol } from "@/lib/utils";

function InfoCard({ label, children }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="mb-1 text-xs text-zinc-400">{label}</p>
      <div className="text-sm font-medium text-zinc-900">{children}</div>
    </div>
  );
}

export default function PlaceDetails({ place }) {
  const level = PRICE_LEVELS.find((l) => l.value === place.priceLevel);
  const hasPrice = Boolean(place.priceInfo) || Boolean(level);

  const hasAny = place.openingHours || hasPrice || place.bestTime || place.duration;
  if (!hasAny) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {place.openingHours && <InfoCard label="Opening hours">{place.openingHours}</InfoCard>}
      {hasPrice && (
        <InfoCard label="Price">
          {place.priceInfo}
          {level && (
            <span className={place.priceInfo ? "ml-2 text-amber-600" : "text-amber-600"}>
              {priceLevelSymbol(level.value)}
              {!place.priceInfo && <span className="ml-2 text-zinc-900">{level.hint}</span>}
            </span>
          )}
        </InfoCard>
      )}
      {place.bestTime && <InfoCard label="Best time">{place.bestTime}</InfoCard>}
      {place.duration && <InfoCard label="Duration">{place.duration}</InfoCard>}
    </div>
  );
}
