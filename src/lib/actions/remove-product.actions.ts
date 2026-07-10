"use server";

import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

// NEW backend: DELETE /api/cart/{id} expects the cart-item id (item._id),
// not the product id. Confirmed and fixed in cart-data.tsx, which was
// passing item.product._id before.
export async function deleteProduct(cartItemId: string) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/cart/${cartItemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to remove item from cart");
  }

  return data?.payload ?? data;
}
