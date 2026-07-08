import { Product } from "@/lib/types/product";

/**
 * The NEW backend (see /api-docs) returns products shaped like:
 *   { id, title, description, stock, price, discountType, discountValue,
 *     categoryId, subCategoryId, occasionId, cover, gallery, ... }
 *
 * ...but the rest of this app's UI (ProductCard, product detail page,
 * cart, wishlist, dashboard tables, etc.) still expects the OLD backend's
 * shape:
 *   { _id, imgCover, images, category, occasion, quantity,
 *     priceAfterDiscount, ... }
 *
 * That mismatch is what causes `product._id` / `product.imgCover` to come
 * back `undefined` everywhere (empty <Image src>, missing React "key",
 * "/products/undefined" links, etc).
 *
 * Rather than touch every component that consumes a Product, every place
 * that fetches raw product data from the backend should run it through
 * `normalizeProduct` (or `normalizeProducts` for a list) first.
 *
 * IMPORTANT: the field names on the right (id, cover, gallery, stock,
 * categoryId, discountType/discountValue) are confirmed from the
 * documented `POST /api/products` request body + the UUID `id` pattern
 * used everywhere else in the Swagger doc. They are NOT yet confirmed
 * against a live `GET /api/products` response. If the real response uses
 * different names, update the `raw.xxx` lookups below - everything else
 * downstream keeps working unchanged.
 */
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

  return {
    _id: raw._id ?? raw.id,
    title: raw.title ?? "",
    slug: raw.slug ?? raw.id ?? "",
    description: raw.description ?? "",
    imgCover: raw.imgCover ?? raw.cover ?? "",
    images: raw.images ?? raw.gallery ?? [],
    price,
    priceAfterDiscount: raw.priceAfterDiscount ?? computedPriceAfterDiscount,
    quantity: raw.quantity ?? raw.stock ?? 0,
    category: raw.category ?? raw.categoryId ?? "",
    occasion: raw.occasion ?? raw.occasionId ?? "",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    sold: raw.sold ?? 0,
    rateAvg: raw.rateAvg ?? raw.rating ?? 0,
    rateCount: raw.rateCount ?? raw.reviewsCount ?? 0,
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
