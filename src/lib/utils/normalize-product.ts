import { Product } from "@/lib/types/product";

/**
 * The NEW backend (confirmed against a live GET /api/products/{id}
 * response) returns products shaped like:
 *   { id, title, description, stock, price, discountType, discountValue,
 *     categoryId, subCategoryId, cover, gallery, rating, ratings,
 *     category: {id, title, ...}, subCategory: {...},
 *     occasions: [{ occasionId, occasion: {id, title, ...} }],
 *     reviews: [...], _count: { reviews, cartItems, wishlistItems } }
 *
 * A few things about that shape are easy to trip over:
 *   - price / discountValue come back as STRINGS ("920", "10").
 *   - gallery comes back as a JSON-encoded STRING ("[]"), not an array.
 *   - category/occasion are nested relation OBJECTS (and occasions is an
 *     array), not the plain categoryId/occasionId strings the rest of the
 *     app (e.g. the edit-product form's <select>) expects.
 *   - the review-count field is "ratings", not "reviewsCount".
 *
 * ...but the rest of this app's UI (ProductCard, product detail page,
 * cart, wishlist, dashboard tables, etc.) still expects the OLD backend's
 * shape:
 *   { _id, imgCover, images, category, occasion, quantity,
 *     priceAfterDiscount, ... }
 *
 * Rather than touch every component that consumes a Product, every place
 * that fetches raw product data from the backend should run it through
 * `normalizeProduct` (or `normalizeProducts` for a list) first.
 */

// gallery can arrive as a real array, a JSON-encoded string ("[]", '["a"]'),
// or be missing entirely - normalize all of those down to a string array.
function parseGallery(gallery: unknown): string[] {
  if (Array.isArray(gallery)) return gallery;
  if (typeof gallery === "string") {
    try {
      const parsed = JSON.parse(gallery);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// category/occasion can arrive as a plain id string, a relation object
// ({ id, title, ... }), or (for occasion) an array of relation wrappers
// ({ occasionId, occasion: { id, ... } }). Pull out just the id.
function extractId(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.id ?? "";
}

export function normalizeProduct(raw: any): Product {
  if (!raw) return raw;

  const price = Number(raw.price ?? 0);
  const discountType: "PERCENT" | "FIXED" | undefined = raw.discountType;
  const discountValue = Number(raw.discountValue ?? raw.discount ?? 0);

  const computedPriceAfterDiscount =
    discountType === "PERCENT"
      ? price - (price * discountValue) / 100
      : discountType === "FIXED"
        ? Math.max(0, price - discountValue)
        : price;

  const firstOccasion = Array.isArray(raw.occasions) ? raw.occasions[0] : undefined;

  return {
    _id: raw._id ?? raw.id,
    title: raw.title ?? "",
    slug: raw.slug ?? raw.id ?? "",
    description: raw.description ?? "",
    imgCover: raw.imgCover ?? raw.cover ?? "",
    images: raw.images ?? parseGallery(raw.gallery),
    price,
    priceAfterDiscount: raw.priceAfterDiscount ?? computedPriceAfterDiscount,
    quantity: raw.quantity ?? raw.stock ?? 0,
    category: raw.categoryId || extractId(raw.category) || "",
    occasion:
      raw.occasionId ||
      extractId(raw.occasion) ||
      firstOccasion?.occasionId ||
      extractId(firstOccasion?.occasion) ||
      "",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    sold: raw.sold ?? 0,
    rateAvg: raw.rateAvg ?? raw.rating ?? 0,
    rateCount: raw.rateCount ?? raw.ratings ?? raw._count?.reviews ?? 0,
    favoriteId: raw.favoriteId ?? null,
    isInWishlist: raw.isInWishlist ?? false,
    isSuperAdmin: raw.isSuperAdmin,
    discount: discountValue || raw.discount,
  };
}

export function normalizeProducts(rawList: any[]): Product[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeProduct);
}
