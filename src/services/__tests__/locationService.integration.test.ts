import { rest } from "msw";
import { setupServer } from "msw/node";
import { searchNearbyAndNormalize } from "src/services/locationService";

describe("locationService integration", () => {
  const server = setupServer(
    rest.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            results: [
              {
                place_id: "p1",
                name: "Pharmacy",
                geometry: { location: { lat: 1, lng: 2 } },
              },
            ],
            status: "OK",
          })
        );
      }
    )
  );
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("returns normalized locations from mocked API", async () => {
    const results = await searchNearbyAndNormalize(1, 2, 1000, "pharmacy");
    expect(results[0].name).toBe("Pharmacy");
    expect(results[0].lat).toBe(1);
    expect(results[0].lng).toBe(2);
  });
});
