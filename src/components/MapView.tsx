/**
 * MapView.tsx
 *
 * React component that initializes a Google Map using @react-google-maps/api,
 * displays markers and clusters, and shows a bottom-sheet with the 3 nearest results.
 *
 * Note: This component relies on the Maps API key available via
 * import.meta.env.VITE_GOOGLE_MAPS_KEY. In production you should restrict this key
 * to your application's domains and consider proxying requests server-side where possible.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import type { Location } from "src/types";
import { searchForRestroomsAndPharmacies } from "src/services/locationService";

const containerStyle = {
  width: "100%",
  height: "600px",
};

type MapViewProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
};

const libraries = ["places"] as ("places" | string)[];

const MapView: React.FC<MapViewProps> = ({
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 13,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey ?? "",
    libraries: libraries as any,
  });

  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);

  useEffect(() => {
    // You may want to use navigator.geolocation for user's actual location.
    // For this component we fetch sample nearby places around the provided center.
    let mounted = true;
    async function load() {
      try {
        const results = await searchForRestroomsAndPharmacies(
          center.lat,
          center.lng,
          3000
        );
        if (!mounted) return;
        setLocations(results);
      } catch (err) {
        // handle error (e.g., show toast)
        console.error("Failed to load nearby places", err);
      }
    }
    if (isLoaded) load();
    return () => {
      mounted = false;
    };
  }, [isLoaded, center.lat, center.lng]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  const centerMemo = useMemo(() => center, [center.lat, center.lng]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  // nearest 3
  const nearest = [...locations]
    .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0))
    .slice(0, 3);

  return (
    <div className="map-view">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerMemo}
        zoom={zoom}
        onLoad={onLoad}
      >
        <MarkerClusterer>
          {(clusterer) =>
            locations.map((loc) => (
              <Marker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                clusterer={clusterer}
                onClick={() => setSelected(loc)}
                title={loc.name}
              />
            ))
          }
        </MarkerClusterer>

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="max-w-xs">
              <h3 className="font-bold">{selected.name}</h3>
              <div className="text-sm text-gray-600">{selected.address}</div>
              <div className="text-sm text-gray-500">
                {selected.distanceMeters ? `${selected.distanceMeters} m` : ""}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* bottom sheet with nearest 3 results */}
      <div className="fixed left-0 right-0 bottom-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Nearest</div>
            {nearest.length === 0 ? (
              <div className="py-2 text-sm text-gray-600">
                No nearby results
              </div>
            ) : (
              <ul className="space-y-1">
                {nearest.map((n) => (
                  <li
                    key={n.id}
                    className="py-2 cursor-pointer"
                    onClick={() => {
                      mapRef?.panTo({ lat: n.lat, lng: n.lng });
                      setSelected(n);
                    }}
                  >
                    <div className="font-medium">{n.name}</div>
                    <div className="text-xs text-gray-500">
                      {n.address} · {n.distanceMeters ?? ""} m
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded"
              onClick={() => {
                // center map back to initial
                if (mapRef) mapRef.panTo(centerMemo);
              }}
            >
              Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
