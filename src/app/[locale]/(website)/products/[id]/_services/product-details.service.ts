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

  // The new backend's product object uses different field names (id vs
  // _id, cover vs imgCover, etc.) - normalizeProduct maps it onto the
  // shape the product detail UI expects.
  return { message: data.message, product: normalizeProduct(data.payload) };
}
