// The new backend's Swagger doc has no "related/similar products" endpoint
// (Products only exposes list/get-by-id/create/update/delete/restore/
// deleted). Guessing a URL here just means every call 404s, so this now
// fails soft (returns no related products) instead of throwing and taking
// the whole product page down with it. If a similar-products feature is
// still needed, it'll need a new endpoint from the backend team - there's
// nothing in the current API to build it from without querying every
// product, which isn't practical client-side.
export async function getRelatedProducts(productId: string) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  // Intentionally not calling the backend - see note above. Keeping the
  // function/signature so callers don't need to change once a real
  // endpoint exists.
  return { similarProducts: [] };
}
