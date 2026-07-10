"use server";
import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

/**
 * Card-payment flow per the new backend's Swagger doc. Used AFTER an order
 * has already been created via AddCheckoutCash({ addressId, paymentMethod:
 * "CREDIT_CARD" }) in checkout.actions.ts.
 *
 *   1. createPaymentIntentAction(orderId) -> Stripe client secret / intent id
 *   2. Client-side, collect card details with Stripe Elements
 *      (@stripe/stripe-js + @stripe/react-stripe-js - not yet a dependency
 *      of this project) and call stripe.confirmCardPayment(clientSecret)
 *      to get back a paymentMethodId.
 *   3. confirmPaymentAction(paymentIntentId, paymentMethodId) to finalize
 *      on the backend.
 *
 * NOTE: step 2 (the actual card entry form) isn't built yet - this project
 * has no Stripe.js dependency installed. The old flow only ever redirected
 * to a Stripe-hosted Checkout page, so there's no existing card form to
 * adapt. That's a separate, larger addition (new package + a dedicated
 * Elements-based step in the checkout UI) - flagging rather than guessing
 * at it here.
 */

export async function createPaymentIntentAction(orderId: string) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/payments/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to create payment intent");
  }

  return data.payload ?? data;
}

export async function confirmPaymentAction(
  paymentIntentId: string,
  paymentMethodId: string
) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/payments/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paymentIntentId, paymentMethodId }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to confirm payment");
  }

  return data.payload ?? data;
}
