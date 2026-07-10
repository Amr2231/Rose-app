"use server";

import {
  DeleteOccasionResponse,
  GetOccasionResponse,
  OccasionsResponse,
} from "../types/occasion";
import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";
import { uploadImage } from "../utils/upload-image";

// Delete Occasion Action
export async function deleteOccasionAction(occasionId: string) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/occasions/${occasionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to delete occasion");
  }

  return (data as DeleteOccasionResponse) ?? { message: "Occasion deleted" };
}

// Add Occasion Action
// NEW backend: POST /api/occasions body: { title, description?, image? }
// (image is a URL from POST /api/upload, not the raw file) - was sending
// FormData with a "name" field straight to the (old, multipart) endpoint.
export async function addOccasionAction(formData: FormData) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const title = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString();
  const imageFile = formData.get("image");

  let image: string | undefined;
  if (imageFile instanceof File && imageFile.size > 0) {
    image = await uploadImage(imageFile, token);
  }

  const res = await fetch(`${getServerApiBase()}/api/occasions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, image }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to create occasion");
  }

  return (data.payload ?? data) as OccasionsResponse;
}

// Update Occasion Action
// NEW backend: PATCH /api/occasions/{id} body: { title?, description?, image? }
export async function updateOccasionAction(
  occasionId: string,
  formData: FormData
) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const title = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageFile = formData.get("image");

  let image: string | undefined;
  if (imageFile instanceof File && imageFile.size > 0) {
    image = await uploadImage(imageFile, token);
  }

  const body: Record<string, unknown> = {};
  if (title) body.title = title;
  if (description) body.description = description;
  if (image) body.image = image;

  const res = await fetch(`${getServerApiBase()}/api/occasions/${occasionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to update occasion");
  }

  return (data.payload ?? data) as OccasionsResponse;
}

////////////////////

export async function getOccasionById(
  id: string
): Promise<GetOccasionResponse> {
  const res = await fetch(`${getServerApiBase()}/api/occasions/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch occasion");

  const data = await res.json();
  return (data.payload ?? data) as GetOccasionResponse;
}
