import React, { useState } from "react";
import type { User, Review } from "src/types";

type ReviewFormProps = {
  locationId: string;
  currentUser?: User | null;
  onSuccess?: (review: Review) => void;
};

const MAX_COMMENT_LENGTH = 500;

const ReviewForm: React.FC<ReviewFormProps> = ({
  locationId,
  currentUser,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    if (!currentUser) return "You must be signed in to submit a review.";
    if (rating === null) return "Please select a rating between 1 and 5.";
    if (rating < 1 || rating > 5) return "Rating must be between 1 and 5.";
    if (comment.length > MAX_COMMENT_LENGTH)
      return `Comment must be at most ${MAX_COMMENT_LENGTH} characters.`;
    return null;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        locationId,
        rating,
        text: comment || undefined,
        userId: currentUser?.id,
        userName: currentUser?.name,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Server responded ${res.status}`);
      }

      const created: Review = await res.json();
      setRating(null);
      setComment("");
      onSuccess?.(created);
    } catch (err: any) {
      setError(err?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!currentUser && (
        <div className="text-sm text-red-600">
          You must sign in to leave a review.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Rating</label>
        <div className="flex gap-2 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              className={`px-3 py-1 rounded ${
                rating === n ? "bg-yellow-400" : "bg-gray-100"
              }`}
              aria-pressed={rating === n}
            >
              {n}★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          className="w-full border rounded px-2 py-1 mt-1"
          rows={4}
        />
        <div className="text-xs text-gray-500">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !currentUser}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
