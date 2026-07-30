"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Housing, Trail } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { TrailCard } from "@/components/trail-card";
import { HousingCard } from "@/components/housing-card";

export default function SavedPage() {
  const { user, loading } = useAuth();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [housing, setHousing] = useState<Housing[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    Promise.all([
      api.listTrails().then((r) => r.trails),
      api.listHousing().then((r) => r.housing),
    ])
      .then(([allTrails, allHousing]) => {
        setTrails(allTrails.filter((t) => user.saved_trails.includes(t.id)));
        setHousing(allHousing.filter((h) => user.saved_housing.includes(h.id)));
      })
      .finally(() => setFetching(false));
  }, [user]);

  if (loading) return <p>Loading…</p>;

  if (!user) {
    return (
      <div>
        <h1 className="page-title">Saved</h1>
        <div className="card auth-card" style={{ marginTop: 0 }}>
          <p style={{ marginTop: 0 }}>Please sign in to view your saved trails and lodges.</p>
          <Link href="/profile" className="btn btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Your Saved Items</h1>
      <p className="page-subtitle">Bookmarked trails and lodges for your Virginia adventure.</p>

      {fetching ? <p>Loading…</p> : null}

      <h2 style={{ color: "var(--maroon)", fontSize: 20 }}>Saved trails</h2>
      {trails.length === 0 ? (
        <p className="page-subtitle">
          No saved trails yet. <Link href="/trails" className="link">Browse trails →</Link>
        </p>
      ) : (
        <div className="grid-cards" style={{ marginBottom: 24 }}>
          {trails.map((t) => (
            <TrailCard key={t.id} trail={t} />
          ))}
        </div>
      )}

      <h2 style={{ color: "var(--maroon)", fontSize: 20 }}>Saved lodges</h2>
      {housing.length === 0 ? (
        <p className="page-subtitle">
          No saved lodges yet. <Link href="/lodges" className="link">Browse lodges →</Link>
        </p>
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
