import React, { useEffect, useState } from "react";
import type { Review } from "src/types";

type ReviewListProps = {
  locationId: string;
  pageSize?: number;
};

type ApiResponse = {
  reviews: Review[];
  total?: number;
};

const ReviewList: React.FC<ReviewListProps> = ({
  locationId,
  pageSize = 10,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/reviews?locationId=${encodeURIComponent(
            locationId
          )}&page=${page}&pageSize=${pageSize}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json: ApiResponse = await res.json();
        if (!mounted) return;
        setReviews(json.reviews);
        setTotal(json.total);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [locationId, page, pageSize]);

  return (
    <div className="review-list">
      <h3 className="text-lg font-semibold">Recent reviews</h3>
      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {!loading && reviews.length === 0 && (
        <div className="text-sm text-gray-500">No reviews yet.</div>
      )}
      <ul className="space-y-3 mt-2">
        {reviews.map((r) => (
          <li key={r.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.authorId || "Anonymous"}</div>
              <div className="text-sm text-yellow-500">{r.rating}★</div>
            </div>
            {r.text && (
              <div className="text-sm text-gray-700 mt-2">{r.text}</div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              {new Date(r.createdAt).toLocaleString?.()}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="px-3 py-1 border rounded"
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">
          Page {page + 1}
          {total ? ` — ${total} reviews` : ""}
        </div>
        <button
          disabled={reviews.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
