"use server";

import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";
import { uploadImage } from "../utils/upload-image";

// NEW backend: POST /api/products body:
//   { title, description, stock, price, discountType?, discountValue?,
//     categoryId, cover, gallery? }
// (cover/gallery are URLs from POST /api/upload, not raw files).
//
// Field-name mapping from this app's form -> new API (confirm with backend
// if any of these guesses are wrong):
//   quantity          -> stock
//   imageCover (File) -> cover (uploaded first, then URL string)
//   gallery (File[])  -> gallery (each uploaded first, then URL strings)
//   category          -> categoryId
//   discount (flat currency amount, price - discount = priceAfterDiscount)
//                      -> discountType: "FIXED", discountValue: <amount>
//     NOT CONFIRMED - the Swagger excerpt only shows a "PERCENT" example.
//     If the backend's discountType enum doesn't include "FIXED", this
//     will need adjusting once confirmed.
//   occasion          -> occasionId - NOT in the documented request body
//     example at all (create-product example only has categoryId). Sent
//     anyway in case the backend accepts it as an optional field; if the
//     new API rejects unknown fields, this will need to be dropped and the
//     occasion relationship set another way (confirm with backend team).
export async function createProduct(values: FormData) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const title = values.get("title")?.toString() ?? "";
  const description = values.get("description")?.toString() ?? "";
  const price = Number(values.get("price"));
  const quantity = values.get("quantity")?.toString() ?? "0";
  const categoryId = values.get("category")?.toString();
  const occasionId = values.get("occasion")?.toString();
  const discount = values.get("discount");
  const coverFile = values.get("imgCover");
  const galleryFiles = values.getAll("images");

  let cover: string | undefined;
  if (coverFile instanceof File && coverFile.size > 0) {
    cover = await uploadImage(coverFile, token);
  }

  const gallery: string[] = [];
  for (const file of galleryFiles) {
    if (file instanceof File && file.size > 0) {
      gallery.push(await uploadImage(file, token));
    }
  }

  const body: Record<string, unknown> = {
    title,
    description,
    price,
    stock: Number(quantity),
    categoryId,
    cover,
    gallery,
  };

  if (occasionId) body.occasionId = occasionId;

  if (discount) {
    body.discountType = "FIXED";
    body.discountValue = Number(discount);
  }

  const res = await fetch(`${getServerApiBase()}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to create product");
  }

  return data.payload ?? data;
}
