import { Category } from "@/lib/types/category";

/**
 * Same problem as normalize-product.ts, but for categories: the new
 * backend returns `{ id, title, description, image, ... }` while the UI
 * (CategoryFilter, dashboard category table, etc.) expects the old
 * backend's `{ _id, name, slug, image, ... }` shape. That's why
 * `cat.name.localeCompare(...)` was crashing - `cat.name` was `undefined`.
 *
 * `image` is passed through unchanged - the new backend returns a full
 * absolute URL (confirmed via the product `cover` field), so it must NOT
 * be re-prefixed with the API base URL.
 */
export function normalizeCategory(raw: any): Category {
  if (!raw) return raw;
  return {
    _id: raw._id ?? raw.id,
    name: raw.name ?? raw.title ?? "",
    slug: raw.slug ?? raw.id ?? "",
    image: raw.image ?? raw.cover ?? "",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    isSuperAdmin: raw.isSuperAdmin ?? false,
    productsCount: raw.productsCount ?? 0,
  };
}

export function normalizeCategories(rawList: any[]): Category[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeCategory);
}
