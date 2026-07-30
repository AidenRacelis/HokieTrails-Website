"use client";

import { useEffect, useState } from "react";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/map";
import { api } from "@/lib/api";
import type { Housing, Trail } from "@/lib/types";
import { TrailCard } from "@/components/trail-card";

export default function MapPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [housing, setHousing] = useState<Housing[]>([]);
  const [showHousing, setShowHousing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listTrails()
      .then((res) => setTrails(res.trails))
      .catch((e) => setError(e.message));
    api
      .listHousing()
      .then((res) => setHousing(res.housing))
      .catch(() => setHousing([]));
  }, []);

  return (
    <div>
      <h1 className="page-title">Explore the Map</h1>
      <p className="page-subtitle">
        Trail markers in maroon, lodging in orange. Click a marker for details.
      </p>

      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <input
          type="checkbox"
          checked={showHousing}
          onChange={(e) => setShowHousing(e.target.checked)}
        />
        Show lodging
      </label>

      {error ? (
        <p className="error-text">Could not load map data: {error}</p>
      ) : null}

      <MapProvider>
        <MapComponent trails={trails} housing={showHousing ? housing : []} />
      </MapProvider>

      <h2 style={{ color: "var(--maroon)", fontSize: 20, marginTop: 26 }}>All trails</h2>
      <div className="grid-cards">
        {trails.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}
