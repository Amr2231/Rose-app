"use server";
import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

// NEW backend contract (per Swagger):
// - POST /api/orders body: { addressId, paymentMethod, couponCode?, notes? }
//   creates the order for BOTH cash and card - there is no separate
//   "/orders/checkout" endpoint anymore.
// - Card payments are a second step after the order exists:
//     POST /api/payments/create-intent { orderId } -> Stripe client secret
//     (confirmed client-side with Stripe Elements, then)
//     POST /api/payments/confirm { paymentIntentId, paymentMethodId }
//   See payments.actions.ts for those two calls.
export async function AddCheckoutCash(fields: CreateOrderPayload) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const response = await fetch(`${getServerApiBase()}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.status === false) {
    throw new Error(payload?.message || payload?.error || "Checkout failed");
  }

  return payload?.payload ?? payload;
}
