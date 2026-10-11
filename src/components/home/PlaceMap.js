"use client";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet touches `window`, so this module is only ever loaded client-side
// through next/dynamic (see PlaceMapView).

const BANGKOK = [13.7563, 100.5018];

function pinIcon(label, selected) {
  const tone = selected ? "background:#D97706;transform:scale(1.1);" : "background:#18181B;";
  return L.divIcon({
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `<div style="${tone}width:36px;height:36px;border-radius:9999px;border:4px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);color:#fff;font:600 12px Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;">${label}</div>`,
  });
}

function FitToPins({ points }) {
  const map = useMap();
  useEffect(() => {
    // The container may have been measured before layout settled.
    map.invalidateSize();
    if (points.length === 1) map.setView(points[0], 14);
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export default function PlaceMap({ pins, selectedId, onSelect }) {
  const points = useMemo(() => pins.map((pin) => [pin.lat, pin.lng]), [pins]);

  return (
    <MapContainer center={points[0] ?? BANGKOK} zoom={12} scrollWheelZoom className="h-full min-h-[360px] w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToPins points={points} />
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={pinIcon(pin.label, pin.id === selectedId)}
          zIndexOffset={pin.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(pin.id) }}
          title={pin.name}
        />
      ))}
    </MapContainer>
  );
}
