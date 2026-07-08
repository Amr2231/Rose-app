import { AddToCartItem } from "../types/cart";

export function guestAddToCart(item: AddToCartItem) {
  const guestCart: AddToCartItem[] = JSON.parse(
    localStorage.getItem("guest-cart") || "[]"
  );

  const existing = guestCart.find(
    (i: AddToCartItem) => i.product === item.product
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    guestCart.push(item);
  }

  localStorage.setItem("guest-cart", JSON.stringify(guestCart));
  return { message: "success", cartItems: guestCart };
}
