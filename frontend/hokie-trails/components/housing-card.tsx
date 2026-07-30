"use client";

import type { Housing } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { Rating, SaveButton } from "./ui";

export function HousingCard({ housing }: { housing: Housing }) {
  const { user, isSavedHousing, toggleSavedHousing } = useAuth();

  return (
    <div className="card">
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "var(--maroon)" }}>{housing.name}</h3>
          <SaveButton
            saved={isSavedHousing(housing.id)}
            disabled={!user}
            onToggle={() => toggleSavedHousing(housing.id)}
          />
        </div>
        <p style={{ margin: "2px 0 10px", color: "#6b7280", fontSize: 13 }}>
          <span style={{ textTransform: "capitalize" }}>{housing.type}</span> · {housing.town}, VA
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ color: "var(--orange)" }}>${housing.price_per_night}/night</strong>
          <Rating value={housing.rating} reviews={housing.reviews} />
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "#4b5563" }}>{housing.description}</p>
        {housing.amenities?.length ? (
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {housing.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                style={{
                  fontSize: 11,
                  background: "#f1ece3",
                  borderRadius: 999,
                  padding: "2px 8px",
                  color: "#5c6472",
                }}
              >
                {a}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
