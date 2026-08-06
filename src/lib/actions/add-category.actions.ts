"use server";

import { getToken } from "@/lib/utils/manage-token";
import { getServerApiBase } from "@/lib/utils/api-response";
import { uploadImage } from "@/lib/utils/upload-image";

// NEW backend: POST /api/categories body: { title, description?, image? }
// (image is a URL from POST /api/upload, not the raw file) - was sending
// FormData with a "name" field straight to the (old, multipart) endpoint.
export async function createCategoryAction(formData: FormData) {
  const token = await getToken();
  const accessToken = token?.accesstoken;
  if (!accessToken) return { success: false, message: "No access token found" };

  try {
    const title = formData.get("name")?.toString() ?? "";
    const description = formData.get("description")?.toString();
    const imageFile = formData.get("image");

    let image: string | undefined;
    if (imageFile instanceof File && imageFile.size > 0) {
      image = await uploadImage(imageFile, accessToken);
    }

    const res = await fetch(`${getServerApiBase()}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title, description, image }),
    });

    const data = await res.json();

    if (!res.ok || data?.status === false) {
      const message =
        data?.error || data?.message || "Failed to create category";
      return { success: false, message };
    }

    return {
      success: true,
      message: data?.message || "Category added successfully",
      document: data.payload ?? data.document ?? data,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
