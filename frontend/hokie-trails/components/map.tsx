"use client";

import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Link from "next/link";
import React, { useRef, useState } from "react";
import type { Housing, Trail } from "@/lib/types";

const mapContainerStyle = { width: "100%", height: "100%" };

// Centered on the Blue Ridge / Shenandoah region of Virginia.
const virginiaCenter = { lat: 38.0, lng: -79.2 };
const defaultZoom = 7;

const mapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeControl: false,
  streetViewControl: false,
};

interface Props {
  trails: Trail[];
  housing?: Housing[];
}

const MapComponent: React.FC<Props> = ({ trails, housing = [] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);
  const [activeHousing, setActiveHousing] = useState<Housing | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <div className="map-wrap">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={virginiaCenter}
        zoom={defaultZoom}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {trails.map((trail) => (
          <Marker
            key={trail.id}
            position={{ lat: trail.coordinates.lat, lng: trail.coordinates.lng }}
            title={trail.name}
            onClick={() => {
              setActiveHousing(null);
              setActiveTrail(trail);
            }}
          />
        ))}

        {housing.map((h) => (
          <Marker
            key={h.id}
            position={{ lat: h.coordinates.lat, lng: h.coordinates.lng }}
            title={h.name}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#e5751f",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            }}
            onClick={() => {
              setActiveTrail(null);
              setActiveHousing(h);
            }}
          />
        ))}

        {activeTrail ? (
          <InfoWindow
            position={{ lat: activeTrail.coordinates.lat, lng: activeTrail.coordinates.lng }}
            onCloseClick={() => setActiveTrail(null)}
          >
            <div style={{ minWidth: 180 }}>
              <strong style={{ color: "#630031" }}>{activeTrail.name}</strong>
              <div style={{ fontSize: 12, color: "#555" }}>
                {activeTrail.town}, VA · {activeTrail.difficulty}
              </div>
              <div style={{ fontSize: 12, margin: "4px 0" }}>
                {activeTrail.length_miles} mi · ⭐ {activeTrail.combined_rating?.toFixed(1)}
              </div>
              <Link href={`/trails/${activeTrail.id}`} style={{ color: "#e5751f", fontWeight: 700 }}>
                View trail →
              </Link>
            </div>
          </InfoWindow>
        ) : null}

        {activeHousing ? (
          <InfoWindow
            position={{ lat: activeHousing.coordinates.lat, lng: activeHousing.coordinates.lng }}
            onCloseClick={() => setActiveHousing(null)}
          >
            <div style={{ minWidth: 160 }}>
              <strong style={{ color: "#630031" }}>{activeHousing.name}</strong>
              <div style={{ fontSize: 12, color: "#555", textTransform: "capitalize" }}>
                {activeHousing.type} · {activeHousing.town}, VA
              </div>
              <div style={{ fontSize: 12, margin: "4px 0" }}>
                ${activeHousing.price_per_night}/night · ⭐ {activeHousing.rating}
              </div>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
