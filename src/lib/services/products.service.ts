"use server"
import { getServerApiBase } from "../utils/api-response";
import { normalizeProducts } from "../utils/normalize-product";

export async function getProducts(params: Record<string, any> = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  });

  const res = await fetch(`${getServerApiBase()}/api/products?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // Surface the backend's real error instead of a generic message - the
    // new API rejects unknown query params on some deployments, so seeing
    // the actual status/body here is the fastest way to tell which filter
    // key is wrong.
    const errBody = await res.json().catch(() => null);
    throw new Error(
      `Failed to fetch products (${res.status}): ${errBody?.message ?? res.statusText}`
    );
  }

  const data = await res.json();

  // New backend wraps everything in { status, code, payload }. The exact
  // shape of the paginated payload isn't documented beyond "payload": "string"
  // in the Swagger excerpt, so this normalizes a few likely shapes down to
  // the { products, metadata } contract every caller in this app expects.
  // Worth confirming the real shape with the backend team.
  const rawPayload = data?.payload ?? data;
  const products = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.products)
      ? rawPayload.products
      : Array.isArray(rawPayload?.items)
        ? rawPayload.items
        : Array.isArray(rawPayload?.data)
          ? rawPayload.data
          : [];

  const metadata = rawPayload?.metadata ?? {
    currentPage: rawPayload?.page ?? 1,
    limit: rawPayload?.limit ?? products.length,
    totalPages: rawPayload?.totalPages ?? 1,
    totalItems: rawPayload?.total ?? products.length,
  };

  // Map the new backend's field names (id/cover/gallery/stock/...) onto
  // the shape every component in this app expects (_id/imgCover/images/
  // quantity/...). See normalize-product.ts for details.
  return { products: normalizeProducts(products), metadata };
}
