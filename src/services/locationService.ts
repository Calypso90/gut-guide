/**
 * locationService.ts
 *
 * Lightweight wrapper around Google Places (Nearby Search) REST endpoint.
 * NOTE: For an actual production app, calls to the Google Places REST API should be
 * done server-side (to keep API key secret) or via a properly restricted API key.
 * This module shows an MVP client-side approach that reads the API key from
 * `import.meta.env.VITE_GOOGLE_MAPS_KEY` and normalizes results to the app's
 * `Location` interface.
 */

import type { Location, PlaceApiResult } from "src/types";

const GOOGLE_PLACES_NEARBY_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

function getApiKey(): string {
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;
  if (!key) throw new Error("VITE_GOOGLE_MAPS_KEY is not set");
  return key;
}

/**
 * Build a Nearby Search URL for Google Places.
 * Uses 'keyword' to allow searching for 'restroom' and 'pharmacy'.
 */
function buildNearbyUrl(
  lat: number,
  lng: number,
  radius = 1500,
  keyword?: string,
  type?: string
) {
  const params = new URLSearchParams();
  params.set("location", `${lat},${lng}`);
  params.set("radius", `${radius}`);
  if (keyword) params.set("keyword", keyword);
  if (type) params.set("type", type);
  params.set("key", getApiKey());
  return `${GOOGLE_PLACES_NEARBY_URL}?${params.toString()}`;
}

/**
 * Normalize a single raw Google Place result into our Location interface.
 */
export function normalizePlaceResult(
  raw: PlaceApiResult,
  refLat?: number,
  refLng?: number
): Location {
  const placeId = raw.place_id ?? raw.id ?? String(Math.random());
  const lat = raw.geometry?.location?.lat ?? raw.geometry?.lat ?? 0;
  const lng = raw.geometry?.location?.lng ?? raw.geometry?.lng ?? 0;

  const loc: Location = {
    id: placeId,
    placeId,
    name: raw.name || "Unknown",
    address: raw.vicinity || raw.formatted_address || undefined,
    lat,
    lng,
    types: raw.types || [],
    rating: raw.rating,
    userRatingsTotal: raw.user_ratings_total,
    vicinity: raw.vicinity,
  };

  if (refLat !== undefined && refLng !== undefined) {
    loc.distanceMeters = distanceBetweenMeters(refLat, refLng, lat, lng);
  }

  return loc;
}

/**
 * Simple haversine distance (meters) between two lat/lng points.
 */
export function distanceBetweenMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Search nearby places by keyword (e.g. 'restroom', 'pharmacy').
 * Returns raw API JSON results array (not normalized) and the status.
 */
export async function searchNearbyRaw(
  lat: number,
  lng: number,
  radius = 1500,
  keyword?: string,
  type?: string
) {
  const url = buildNearbyUrl(lat, lng, radius, keyword, type);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Places API HTTP error ${res.status}`);
  }
  const json = await res.json();
  return json;
}

/**
 * Search and normalize nearby results for a keyword. Returns normalized Location[]
 */
export async function searchNearbyAndNormalize(
  lat: number,
  lng: number,
  radius = 1500,
  keyword?: string,
  type?: string
) {
  const json = await searchNearbyRaw(lat, lng, radius, keyword, type);
  const results = (json.results || []) as PlaceApiResult[];
  return results.map((r) => normalizePlaceResult(r, lat, lng));
}

/**
 * Convenience: search for both restrooms and pharmacies and merge unique results.
 * Uses 'restroom' and 'pharmacy' keywords under the given radius.
 */
export async function searchForRestroomsAndPharmacies(
  lat: number,
  lng: number,
  radius = 1500
) {
  const [restrooms, pharmacies] = await Promise.all([
    searchNearbyAndNormalize(lat, lng, radius, "restroom"),
    searchNearbyAndNormalize(lat, lng, radius, "pharmacy", "pharmacy"),
  ]);

  const map = new Map<string, Location>();
  [...restrooms, ...pharmacies].forEach((loc) => {
    map.set(loc.placeId ?? loc.id, loc);
  });

  const merged = Array.from(map.values());
  // sort by distance if present
  merged.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
  return merged;
}

export default {
  searchNearbyRaw,
  searchNearbyAndNormalize,
  searchForRestroomsAndPharmacies,
  normalizePlaceResult,
  distanceBetweenMeters,
};
