"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Housing, Trail } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { DifficultyBadge, Rating, SaveButton } from "@/components/ui";
import { HousingCard } from "@/components/housing-card";

export default function TrailDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, isSavedTrail, toggleSavedTrail } = useAuth();

  const [trail, setTrail] = useState<Trail | null>(null);
  const [housing, setHousing] = useState<Housing[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getTrail(id)
      .then((res) => setTrail(res.trail))
      .catch((e) => setError(e.message));
    api
      .housingNearTrail(id)
      .then((res) => setHousing(res.housing))
      .catch(() => setHousing([]));
  }, [id]);

  if (error) return <p className="error-text">Could not load trail: {error}</p>;
  if (!trail) return <p>Loading…</p>;

  return (
    <div>
      <Link href="/trails" className="link">
        ← Back to trails
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginTop: 12 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>
            {trail.name}
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 8 }}>
            {trail.town}
            {trail.county ? `, ${trail.county}` : ""}, Virginia
          </p>
        </div>
        <SaveButton
          saved={isSavedTrail(trail.id)}
          disabled={!user}
          onToggle={() => toggleSavedTrail(trail.id)}
        />
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <DifficultyBadge difficulty={trail.difficulty} />
        {trail.elevation_difficulty ? (
          <span style={{ fontSize: 13, color: "#5c6472" }}>{trail.elevation_difficulty}</span>
        ) : null}
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 22 }}>
        <p style={{ marginTop: 0 }}>{trail.description}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 14,
            marginTop: 12,
          }}
        >
          <Stat label="Length" value={`${trail.length_miles} mi`} />
          <Stat label="Elevation gain" value={`${trail.elevation_gain_ft.toLocaleString()} ft`} />
          {trail.highest_elevation_ft ? (
            <Stat label="Peak elevation" value={`${trail.highest_elevation_ft.toLocaleString()} ft`} />
          ) : null}
          <Stat label="Route type" value={trail.route_type || "—"} />
          {trail.best_season ? <Stat label="Best season" value={trail.best_season} /> : null}
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#8a93a3" }}>Google</div>
            <Rating value={trail.ratings.google?.rating} reviews={trail.ratings.google?.reviews} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#8a93a3" }}>AllTrails</div>
            <Rating value={trail.ratings.alltrails?.rating} reviews={trail.ratings.alltrails?.reviews} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#8a93a3" }}>Combined</div>
            <Rating value={trail.combined_rating} />
          </div>
        </div>
      </div>

      <h2 style={{ color: "var(--maroon)", fontSize: 20 }}>Routes</h2>
      <div className="grid-cards" style={{ marginBottom: 24 }}>
        {trail.routes.map((route) => (
          <div key={route.name} className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <strong>{route.name}</strong>
              <DifficultyBadge difficulty={route.difficulty} />
            </div>
            <p style={{ margin: "8px 0", fontSize: 13, color: "#4b5563" }}>{route.description}</p>
            <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#4b5563" }}>
              <span>📏 {route.distance_miles} mi</span>
              <span>⛰️ {route.elevation_gain_ft.toLocaleString()} ft</span>
              <span style={{ textTransform: "capitalize" }}>🧭 {route.type}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ color: "var(--maroon)", fontSize: 20 }}>Stay nearby</h2>
      {housing.length === 0 ? (
        <p className="page-subtitle">No lodging linked to this trail yet.</p>
      ) : (
        <div className="grid-cards">
          {housing.map((h) => (
            <HousingCard key={h.id} housing={h} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#8a93a3" }}>{label}</div>
      <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{value}</div>
    </div>
  );
}
