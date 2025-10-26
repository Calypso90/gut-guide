import React from "react";
import { render, screen } from "@testing-library/react";
import MapView from "src/components/MapView";

// Mock @react-google-maps/api
jest.mock("@react-google-maps/api", () => ({
  __esModule: true,
  GoogleMap: ({ children }: any) => (
    <div data-testid="google-map">{children}</div>
  ),
  Marker: () => <div data-testid="marker" />,
  InfoWindow: ({ children }: any) => (
    <div data-testid="info-window">{children}</div>
  ),
  useJsApiLoader: () => ({ isLoaded: true, loadError: undefined }),
  MarkerClusterer: ({ children }: any) => (
    <div data-testid="clusterer">{children({})}</div>
  ),
}));

describe("MapView", () => {
  it("renders map and markers", () => {
    render(<MapView center={{ lat: 0, lng: 0 }} />);
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
    expect(screen.getByTestId("clusterer")).toBeInTheDocument();
  });
});
