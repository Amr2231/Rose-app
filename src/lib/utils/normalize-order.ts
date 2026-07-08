import { normalizeProduct } from "./normalize-product";

/**
 * The new backend's Swagger doc documents the order *request* bodies
 * (POST /api/orders: { addressId, paymentMethod, couponCode?, notes? },
 * PATCH /api/orders/{id}: { status, trackingNumber }) and the enums:
 *   status:        PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED
 *                  | CANCELLED | REFUNDED
 *   paymentStatus: PENDING | PROCESSING | SUCCEEDED | FAILED | REFUNDED
 *                  | CANCELLED
 * ...but not the actual GET /api/orders response shape (just
 * "payload": "string"). This was previously passed straight through
 * unnormalized, so every field the orders UI reads (order._id,
 * order.orderNumber, order.state, order.paymentType, order.isPaid,
 * order.isDelivered, order.orderItems[].product.imgCover, ...) came back
 * undefined against the new API - broken images, blank badges, etc.
 *
 * This maps the new backend's documented fields (plus the `id`-not-`_id`
 * convention used everywhere else in the new API) down to the old shape
 * OrderCard / OrderStatusBadge / OrderPaymentInfo / OrderItemsPreview
 * already expect, so the existing UI keeps working without a rewrite.
 * Update the `raw.xxx` lookups below once the real response is confirmed.
 */

function mapOrderState(status: string | undefined): OrderState {
  switch (status) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
    case "PROCESSING":
    case "SHIPPED":
      return "inProgress";
    case "DELIVERED":
      return "done";
    case "CANCELLED":
    case "REFUNDED":
      return "cancelled";
    default:
      return "pending";
  }
}

function mapPaymentType(paymentMethod: string | undefined): PaymentType {
  if (!paymentMethod) return "cash";
  const normalized = paymentMethod.toUpperCase();
  if (normalized.includes("CARD")) return "credit_card";
  return "cash";
}

export function normalizeOrderItem(raw: any): OrderItem {
  if (!raw) return raw;

  return {
    _id: raw._id ?? raw.id ?? "",
    product: normalizeProduct(raw.product ?? raw.productId ?? raw),
    price: Number(raw.price ?? 0),
    quantity: Number(raw.quantity ?? 1),
  };
}

export function normalizeOrder(raw: any): Order {
  if (!raw) return raw;

  const rawItems = raw.orderItems ?? raw.items ?? [];

  return {
    _id: raw._id ?? raw.id ?? "",
    user: raw.user ?? raw.userId ?? "",
    orderItems: Array.isArray(rawItems) ? rawItems.map(normalizeOrderItem) : [],
    totalPrice: Number(raw.totalPrice ?? raw.total ?? 0),
    paymentType: mapPaymentType(raw.paymentType ?? raw.paymentMethod),
    isPaid: raw.isPaid ?? raw.paymentStatus === "SUCCEEDED",
    isDelivered: raw.isDelivered ?? raw.status === "DELIVERED",
    state: raw.state ?? mapOrderState(raw.status),
    orderNumber:
      raw.orderNumber ?? (raw.id ?? raw._id ?? "").toString().slice(0, 8).toUpperCase(),
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
}

export function normalizeOrders(rawList: any[]): Order[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeOrder);
}
