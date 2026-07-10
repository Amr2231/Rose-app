import { Review } from "@/lib/types/review";
import { getServerApiBase } from "../utils/api-response";
import { normalizeReviews } from "../utils/normalize-review";

// Fetches all reviews from the API
export async function getAllReviews(): Promise<{ reviews: Review[] }> {
  const res = await fetch(`${getServerApiBase()}/api/reviews`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch reviews");

  const data = await res.json();
  // New backend returns a paginated payload; normalize to { reviews: [] }
  // for existing callers regardless of exact pagination wrapper shape.
  const rawReviews = Array.isArray(data?.payload)
    ? data.payload
    : Array.isArray(data?.payload?.reviews)
      ? data.payload.reviews
      : Array.isArray(data?.reviews)
        ? data.reviews
        : [];
  // Map new backend field names (id/headline/content/productId/userId) onto
  // what the UI expects (_id/title/comment/product/user) - see
  // normalize-review.ts.
  return { reviews: normalizeReviews(rawReviews) };
}

// Creates a new product review
export async function createReview(
  token: string,
  payload: {
    product: string;
    rating: number;
    title: string;
    comment: string;
  }
) {
  // Map old field names to the new API's contract:
  // { productId, headline, content, rating }
  const body = {
    productId: payload.product,
    headline: payload.title,
    content: payload.comment,
    rating: payload.rating,
  };

  const res = await fetch(`${getServerApiBase()}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to create review");
  }

  return data.payload ?? data;
}
