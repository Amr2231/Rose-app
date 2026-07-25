"use server";

import { getMyToken } from "@/lib/utils/get-my-token";

// delete product action
export async function deleteProductAction(productId: string): Promise<void> {
  const token = await getMyToken();
  if (!token?.accesstoken) throw new Error("Unauthorized");

  const res = await fetch(`${process.env.API}/api/products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token.accesstoken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
}
