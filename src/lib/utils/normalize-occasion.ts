/**
 * Same problem as normalize-product.ts / normalize-category.ts, but for
 * occasions: the new backend returns `{ id, title, description, image }`
 * while the UI (OccasionsTabs, occasions-filter sidebar, etc.) expects
 * the old backend's `{ _id, name, slug, image, ... }` shape.
 *
 * `image` is passed through unchanged - it's already a full absolute URL
 * from the new backend, so it must NOT be re-prefixed with the API base
 * URL (that was causing the doubled-up
 * "https://.../https://.../storage/..." 404s).
 */
export function normalizeOccasion(raw: any) {
  if (!raw) return raw;
  return {
    _id: raw._id ?? raw.id,
    name: raw.name ?? raw.title ?? "",
    slug: raw.slug ?? raw.id ?? "",
    image: raw.image ?? raw.cover ?? "",
    description: raw.description ?? "",
    productsCount: raw.productsCount ?? 0,
  };
}

export function normalizeOccasions(rawList: any[]) {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeOccasion);
}
