"use server";

import { AddToCartItem, CartResponse } from "../types/cart";
import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";
import { normalizeCart } from "../utils/normalize-cart";

export async function addToCartAction(item: AddToCartItem) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    // The documented body is { productId, quantity }; the AddToCartItem
    // type used across this app's guest-cart/localStorage logic still
    // calls that field "product" though, so remap it here rather than
    // rename the field everywhere it's used.
    body: JSON.stringify({
      productId: item.product,
      quantity: item.quantity,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to add item to cart");
  }

  return normalizeCart(data?.payload ?? data) as CartResponse;
}
