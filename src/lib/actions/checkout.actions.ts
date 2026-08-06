"use server";
import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

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
    // Surface field-level validation messages from the backend when
    // present (e.g. { errors: [{ message: "..." }] }), falling back to the
    // generic top-level message.
    const fieldErrors = Array.isArray(payload?.errors)
      ? payload.errors
          .map((e: any) => e?.message || e?.msg || JSON.stringify(e))
          .join(", ")
      : null;

    throw new Error(
      fieldErrors || payload?.message || payload?.error || "Checkout failed",
    );
  }

  return payload?.payload ?? payload;
}
