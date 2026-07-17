import { CartResponse } from "@/lib/types/cart";

export async function getCartService(): Promise<CartResponse> {
  const res = await fetch(`/api/cart`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch Cart");

  return res.json();
}
