"use server";

import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

// NEW backend: method changed PUT -> PATCH, and the id in the URL is the
// cart-item id (item._id), not the product id. Confirmed and fixed in
// cart-data.tsx, which was passing item.product._id before.
export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/cart/${cartItemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to update cart item");
  }

  return data?.payload ?? data;
}
