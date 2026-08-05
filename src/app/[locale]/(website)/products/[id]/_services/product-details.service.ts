import { ProductDetailsResponse } from "@/lib/types/product";
import { getClientApiBase } from "@/lib/utils/api-response";
import { normalizeProduct } from "@/lib/utils/normalize-product";

export async function getProductDetails(
  id: string
): Promise<ProductDetailsResponse> {
  const res = await fetch(
    `${getClientApiBase()}/api/products/${id}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch product details");

  const data = await res.json();

  // Confirmed against a live response: GET /api/products/{id} nests the
  // product one level deeper than the list endpoint - payload.product, not
  // payload itself. Reading data.payload directly meant every field
  // (price/stock/cover/...) was undefined, which is why the detail page
  // was showing 0 EGP / out of stock / no image for every product.
  //
  // normalizeProduct then maps the new backend's field names (id vs _id,
  // cover vs imgCover, etc.) onto the shape the product detail UI expects.
  return {
    message: data.message,
    product: normalizeProduct(data.payload?.product ?? data.payload),
  };
}
