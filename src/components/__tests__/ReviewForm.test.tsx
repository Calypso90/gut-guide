import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewForm from "src/components/ReviewForm";

describe("ReviewForm validation", () => {
  const user = { id: "u1", name: "Tester" };

  test("shows error when no rating selected", async () => {
    const onSuccess = jest.fn();
    render(
      <ReviewForm locationId="loc1" currentUser={user} onSuccess={onSuccess} />
    );
    const submit = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submit);
    expect(await screen.findByText(/select a rating/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test("requires authentication", async () => {
    const onSuccess = jest.fn();
    render(
      <ReviewForm locationId="loc1" currentUser={null} onSuccess={onSuccess} />
    );
    const submit = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submit);
    expect(await screen.findByText(/must be signed in/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
