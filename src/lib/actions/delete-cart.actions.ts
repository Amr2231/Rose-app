"use server";

import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

export async function deleteCart() {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/cart`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to clear cart");
  }

  return data?.payload ?? data;
}
