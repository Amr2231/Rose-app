import { Review } from "@/lib/types/review";

/**
 * The new backend's POST /api/reviews body is documented as
 *   { productId, headline, content, rating }
 * but GET /api/reviews isn't spelled out beyond "payload": "string". Given
 * every other list endpoint in the new API uses `id` (not `_id`) and the
 * create body's field names, a GET response most likely looks like:
 *   { id, productId, userId, headline, content, rating, createdAt, ... }
 * possibly with `user`/`product` populated as objects instead of bare ids.
 *
 * This normalizes either shape down to the { _id, title, comment, user,
 * product } contract review-list.tsx (and the rest of this app) already
 * expects, the same way normalizeProduct/normalizeCategory/normalizeCart do
 * for their endpoints. If the real response differs, only the `raw.xxx`
 * lookups below need updating.
 */
export function normalizeReview(raw: any): Review {
  if (!raw) return raw;

  const rawUser = raw.user ?? raw.userId;
  const user =
    rawUser && typeof rawUser === "object"
      ? {
          _id: rawUser._id ?? rawUser.id ?? "",
          firstName: rawUser.firstName ?? "",
          lastName: rawUser.lastName ?? "",
          photo: rawUser.photo ?? "",
        }
      : {
          _id: typeof rawUser === "string" ? rawUser : "",
          firstName: "",
          lastName: "",
          photo: "",
        };

  const rawProduct = raw.product ?? raw.productId;
  const product =
    rawProduct && typeof rawProduct === "object"
      ? {
          _id: rawProduct._id ?? rawProduct.id ?? "",
          title: rawProduct.title ?? "",
          imgCover: rawProduct.imgCover ?? rawProduct.cover ?? "",
        }
      : {
          _id: typeof rawProduct === "string" ? rawProduct : "",
          title: "",
          imgCover: "",
        };

  return {
    _id: raw._id ?? raw.id ?? "",
    rating: Number(raw.rating ?? 0),
    title: raw.title ?? raw.headline ?? "",
    comment: raw.comment ?? raw.content ?? "",
    status: raw.status ?? "",
    createdAt: raw.createdAt ?? "",
    user,
    product,
  };
}

export function normalizeReviews(rawList: any[]): Review[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeReview);
}
