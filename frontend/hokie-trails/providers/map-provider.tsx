"use client";

import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { ReactNode } from "react";

const libraries = ["places", "drawing", "geometry"];

export function MapProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string | undefined;

  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: libraries as Libraries,
  });

  if (!apiKey) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <strong>Map unavailable.</strong>
        <p style={{ margin: "6px 0 0", color: "#5c6472", fontSize: 14 }}>
          Set <code>NEXT_PUBLIC_GOOGLE_MAP_API</code> in <code>.env.local</code> to
          enable the interactive Google Map. The trail list below still works
          without it.
        </p>
      </div>
    );
  }

  if (loadError) return <p>Encountered an error while loading Google Maps.</p>;
  if (!scriptLoaded) return <p>Map is loading…</p>;

  return <>{children}</>;
}
