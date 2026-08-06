"use server";

import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

export async function deleteCategoryAction(
  categoryId: string
): Promise<{ success: boolean; message: string }> {
  const token = await getToken();
  const accesstoken = token?.accesstoken;

  if (!accesstoken) return { success: false, message: "No access token found" };

  try {
    const res = await fetch(`${getServerApiBase()}/api/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "Content-Type": "application/json",
      },
    });

    let message = res.ok
      ? "Category deleted successfully"
      : `Failed to delete category: ${res.status} ${res.statusText}`;

    try {
      const data = await res.json();
      if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
    } catch {}

    return { success: res.ok, message };
  } catch (err: any) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
