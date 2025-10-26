/**
 * Unit tests for locationService using Jest + MSW (Mock Service Worker)
 *
 * Notes:
 * - This test file uses `node` MSW server to intercept fetch requests to the
 *   Google Places REST endpoint and returns example JSON.
 * - Install the following dev dependencies to run these tests:
 *   jest @types/jest ts-jest msw whatwg-fetch
 */

import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  searchNearbyAndNormalize,
  normalizePlaceResult,
} from "src/services/locationService";
import type { Location } from "src/types";

// Example minimal response from Google Places Nearby Search
const examplePlacesResponse = {
  results: [
    {
      place_id: "place_1",
      name: "Sample Pharmacy",
      geometry: { location: { lat: 37.775, lng: -122.418 } },
      vicinity: "123 Fake St",
      rating: 4.2,
      user_ratings_total: 58,
      types: ["pharmacy", "health"],
    },
    {
      place_id: "place_2",
      name: "Public Restroom",
      geometry: { location: { lat: 37.776, lng: -122.417 } },
      vicinity: "Near Park",
      types: ["restroom"],
    },
  ],
  status: "OK",
};

const server = setupServer(
  rest.get(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(examplePlacesResponse));
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("locationService", () => {
  test("searchNearbyAndNormalize returns normalized locations", async () => {
    // Provide coordinates and call
    const results = await searchNearbyAndNormalize(
      37.7749,
      -122.4194,
      1500,
      "pharmacy"
    );
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    const first = results[0];
    expect((first as Location).name).toBeDefined();
    expect((first as Location).lat).toBeDefined();
    expect((first as Location).lng).toBeDefined();
    expect((first as Location).distanceMeters).toBeGreaterThanOrEqual(0);
  });

  test("normalizePlaceResult computes distance when reference provided", () => {
    const raw = examplePlacesResponse.results[0];
    const normalized = normalizePlaceResult(raw, 37.7749, -122.4194);
    expect(normalized.name).toBe("Sample Pharmacy");
    expect(normalized.distanceMeters).toBeGreaterThanOrEqual(0);
  });
});
