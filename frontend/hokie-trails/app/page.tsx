"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Trail } from "@/lib/types";
import { TrailCard } from "@/components/trail-card";

export default function Home() {
  const [featured, setFeatured] = useState<Trail[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listTrails({ sort: "rating", limit: 6 })
      .then((res) => setFeatured(res.trails))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <section
        style={{
          background: "linear-gradient(120deg, #630031 0%, #8a1245 60%, #e5751f 140%)",
          color: "#fff",
          borderRadius: 20,
          padding: "40px 32px",
          marginBottom: 28,
        }}
      >
        <h1 style={{ fontSize: 40, margin: "0 0 8px", fontWeight: 800 }}>
          Let&apos;s Go Hiking!
        </h1>
        <p style={{ fontSize: 18, maxWidth: 620, opacity: 0.95, margin: "0 0 20px" }}>
          Discover the best hiking trails across the Commonwealth of Virginia — with
          difficulty ratings from Google &amp; AllTrails, every route, and the perfect
          lodge or cabin to stay alongside the trail.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/trails" className="btn btn-primary">
            Browse Trails
          </Link>
          <Link href="/map" className="btn btn-outline" style={{ background: "transparent", color: "#fff", borderColor: "#fff" }}>
            Open the Map
          </Link>
        </div>
      </section>

      <h2 className="page-title" style={{ fontSize: 24 }}>
        Top-rated Virginia trails
      </h2>
      <p className="page-subtitle">The highest-rated hikes based on Google &amp; AllTrails reviews.</p>

      {error ? (
        <p className="error-text">
          Could not reach the API ({error}). Is the backend running on port 5000?
        </p>
      ) : null}

      <div className="grid-cards">
        {featured.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}
