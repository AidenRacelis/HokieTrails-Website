"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type TrailFilters } from "@/lib/api";
import type { Trail } from "@/lib/types";
import { TrailCard } from "@/components/trail-card";

export default function TrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [towns, setTowns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [town, setTown] = useState("");
  const [sort, setSort] = useState("rating");

  const filters: TrailFilters = useMemo(
    () => ({ q, difficulty, town, sort }),
    [q, difficulty, town, sort],
  );

  useEffect(() => {
    api
      .listTowns()
      .then((res) => setTowns(res.towns))
      .catch(() => setTowns([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      api
        .listTrails(filters)
        .then((res) => {
          setTrails(res.trails);
          setError(null);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [filters]);

  return (
    <div>
      <h1 className="page-title">Virginia Hiking Trails</h1>
      <p className="page-subtitle">Filter by difficulty, town, and rating.</p>

      <div className="filters">
        <div className="field" style={{ flex: 1, minWidth: 220 }}>
          <label>Search</label>
          <input
            className="input"
            placeholder="Search trails, towns…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Difficulty</label>
          <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="field">
          <label>Town</label>
          <select className="input" value={town} onChange={(e) => setTown(e.target.value)}>
            <option value="">All towns</option>
            {towns.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Sort by</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="rating">Top rated</option>
            <option value="length">Shortest</option>
            <option value="difficulty">Easiest first</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {error ? <p className="error-text">Could not load trails: {error}</p> : null}
      {loading ? <p>Loading trails…</p> : null}
      {!loading && trails.length === 0 ? <p>No trails match your filters.</p> : null}

      <div className="grid-cards">
        {trails.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}
