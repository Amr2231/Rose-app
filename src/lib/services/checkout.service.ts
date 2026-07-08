export async function AddCheckoutCash(payload: CreateOrderPayload) {
  const res = await fetch(`/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Checkout failed");
  }

  return res.json();
}
