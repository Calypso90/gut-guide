import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewForm from "src/components/ReviewForm";

describe("ReviewForm validation", () => {
  const user = { id: "u1", name: "Tester" };

  it("shows error when no rating selected", async () => {
    render(
      <ReviewForm locationId="loc1" currentUser={user} onSuccess={jest.fn()} />
    );
    fireEvent.click(screen.getByRole("button", { name: /submit review/i }));
    expect(await screen.findByText(/select a rating/i)).toBeInTheDocument();
  });

  it("requires authentication", async () => {
    render(
      <ReviewForm locationId="loc1" currentUser={null} onSuccess={jest.fn()} />
    );
    fireEvent.click(screen.getByRole("button", { name: /submit review/i }));
    expect(await screen.findByText(/must be signed in/i)).toBeInTheDocument();
  });
});
