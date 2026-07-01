"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Housing } from "@/lib/types";
import { HousingCard } from "@/components/housing-card";

export default function LodgesPage() {
  const [housing, setHousing] = useState<Housing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("rating");

  const filters = useMemo(
    () => ({ type, max_price: maxPrice, sort }),
    [type, maxPrice, sort],
  );

  useEffect(() => {
    setLoading(true);
    api
      .listHousing(filters)
      .then((res) => {
        setHousing(res.housing);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <h1 className="page-title">Lodges &amp; Stays</h1>
      <p className="page-subtitle">
        Cabins, lodges, and campgrounds located alongside Virginia&apos;s trails.
      </p>

      <div className="filters">
        <div className="field">
          <label>Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="lodge">Lodge</option>
            <option value="cabin">Cabin</option>
            <option value="campground">Campground</option>
            <option value="hotel">Hotel</option>
          </select>
        </div>
        <div className="field">
          <label>Max price / night</label>
          <input
            className="input"
            type="number"
            placeholder="e.g. 150"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Sort by</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="rating">Top rated</option>
            <option value="price">Lowest price</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {error ? <p className="error-text">Could not load lodging: {error}</p> : null}
      {loading ? <p>Loading lodging…</p> : null}

      <div className="grid-cards">
        {housing.map((h) => (
          <HousingCard key={h.id} housing={h} />
        ))}
      </div>
    </div>
  );
}
