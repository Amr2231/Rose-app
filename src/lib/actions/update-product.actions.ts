"use server";

import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

// NEW backend: PATCH /api/products/{id} body (all optional):
//   { title, description, stock, price, discountType, discountValue,
//     categoryId, cover, gallery }
// Same field-name mapping caveats as create-product.actions.ts
// (quantity -> stock, category -> categoryId) - the update form currently
// doesn't collect a new cover/gallery image, so those aren't sent here.
export async function updateProduct(values: FormData, productId: string) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const body: Record<string, unknown> = {};

  const title = values.get("title")?.toString();
  const description = values.get("description")?.toString();
  const price = values.get("price");
  const quantity = values.get("quantity")?.toString();
  const categoryId = values.get("category")?.toString();

  if (title) body.title = title;
  if (description) body.description = description;
  if (price) body.price = Number(price);
  if (quantity) body.stock = Number(quantity);
  if (categoryId) body.categoryId = categoryId;

  const res = await fetch(`${getServerApiBase()}/api/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to update product");
  }

  return data.payload ?? data;
}
