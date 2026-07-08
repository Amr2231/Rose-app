import { Cart, CartItem, CartResponse } from "@/lib/types/cart";
import { normalizeProduct } from "./normalize-product";

/**
 * The new backend's Swagger doc only documents GET /api/cart as returning
 * `payload: "string"` (i.e. the real shape isn't spelled out). Every other
 * list endpoint in the new API wraps its data and uses `id` instead of
 * `_id`, so this assumes the cart follows the same convention:
 *   payload: { id, cartItems: [{ id, product: <raw product>, price, quantity }], totalPrice, ... }
 *
 * This normalizes that (or a few other likely shapes) down to the
 * { message, numOfCartItems, cart: { _id, cartItems: [{ _id, product, price,
 * quantity }], totalPrice }, price } contract every component in this app
 * expects (header badge, cart page, add-to-cart flows).
 *
 * If the real backend response uses different field names, only the
 * `raw.xxx` lookups below need updating - everything downstream keeps
 * working unchanged.
 */
export function normalizeCartItem(raw: any): CartItem {
  if (!raw) return raw;

  return {
    _id: raw._id ?? raw.id ?? "",
    product: normalizeProduct(raw.product ?? raw.productId ?? raw),
    price: Number(raw.price ?? raw.product?.price ?? 0),
    quantity: Number(raw.quantity ?? 1),
  };
}

export function normalizeCart(rawPayload: any): CartResponse {
  const rawCart = rawPayload?.cart ?? rawPayload ?? {};

  const rawItems = Array.isArray(rawCart?.cartItems)
    ? rawCart.cartItems
    : Array.isArray(rawCart?.items)
      ? rawCart.items
      : Array.isArray(rawPayload?.cartItems)
        ? rawPayload.cartItems
        : [];

  const cartItems: CartItem[] = rawItems.map(normalizeCartItem);

  const totalPrice =
    rawCart?.totalPrice ??
    rawPayload?.totalPrice ??
    rawPayload?.price ??
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const numOfCartItems =
    rawPayload?.numOfCartItems ??
    rawCart?.numOfCartItems ??
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cart: Cart = {
    _id: rawCart?._id ?? rawCart?.id ?? "",
    user: rawCart?.user ?? rawCart?.userId ?? "",
    cartItems,
    appliedCoupons: rawCart?.appliedCoupons ?? [],
    totalPrice,
    createdAt: rawCart?.createdAt ?? "",
    updatedAt: rawCart?.updatedAt ?? "",
    __v: rawCart?.__v ?? 0,
  };

  return {
    message: rawPayload?.message ?? "",
    numOfCartItems,
    cart,
    price: totalPrice,
  };
}
