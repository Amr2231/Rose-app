"use server"
import { getServerApiBase } from "../utils/api-response";
import { normalizeProduct } from "../utils/normalize-product";

export async function getSingleProduct(id: string) {
  const res = await fetch(
    `${getServerApiBase()}/api/products/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch product details");

  const data = await res.json();
  return normalizeProduct(data.payload ?? data);
}
