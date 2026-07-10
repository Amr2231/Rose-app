"use server";

import { getToken } from "@/lib/utils/manage-token";
import { getServerApiBase } from "@/lib/utils/api-response";

// NEW backend: PATCH /api/categories/{id}  body: { title, description?, image? }
// (was: PUT with FormData field "name" - wrong method, wrong content-type,
// and wrong field name for the new API)
export async function updateCategoryAction(id: string, title: string) {
  const token = await getToken();
  const accessToken = token?.accesstoken;

  if (!accessToken) {
    return { success: false, message: "No access token found" };
  }

  try {
    const res = await fetch(`${getServerApiBase()}/api/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    if (!res.ok || data?.status === false) {
      const message =
        data?.error || data?.message || "Failed to update category";
      return { success: false, message };
    }

    return {
      success: true,
      message: data?.message || "Category updated successfully",
      document: data.payload ?? data.document ?? data,
    };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
