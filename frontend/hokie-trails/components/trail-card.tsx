"use client";

import Link from "next/link";
import type { Trail } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { DifficultyBadge, Rating, SaveButton } from "./ui";

export function TrailCard({ trail }: { trail: Trail }) {
  const { user, isSavedTrail, toggleSavedTrail } = useAuth();

  return (
    <Link href={`/trails/${trail.id}`} className="card" style={{ display: "block" }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "var(--maroon)" }}>{trail.name}</h3>
          <SaveButton
            saved={isSavedTrail(trail.id)}
            disabled={!user}
            onToggle={() => toggleSavedTrail(trail.id)}
          />
        </div>
        <p style={{ margin: "2px 0 10px", color: "#6b7280", fontSize: 13 }}>
          {trail.town}, VA
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <DifficultyBadge difficulty={trail.difficulty} />
          <Rating value={trail.combined_rating} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 12,
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          <span>📏 {trail.length_miles} mi</span>
          <span>⛰️ {trail.elevation_gain_ft.toLocaleString()} ft gain</span>
          <span>🧭 {trail.routes.length} routes</span>
        </div>
      </div>
    </Link>
  );
}
