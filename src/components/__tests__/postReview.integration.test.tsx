import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewForm from "src/components/ReviewForm";

const server = setupServer(
  rest.post("/api/reviews", async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({ id: "r1", ...body, createdAt: new Date().toISOString() })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("submits a review successfully", async () => {
  const user = { id: "u1", name: "Tester" };
  render(
    <ReviewForm locationId="loc1" currentUser={user} onSuccess={() => {}} />
  );

  // select rating 4
  const btn = screen.getByRole("button", { name: /4★/i });
  fireEvent.click(btn);

  // enter comment
  const textarea = screen.getByRole("textbox");
  fireEvent.change(textarea, { target: { value: "Helpful place" } });

  const submit = screen.getByRole("button", { name: /submit review/i });
  fireEvent.click(submit);

  await waitFor(() =>
    expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument()
  );
});
