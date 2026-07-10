"use server";
import { ApiResponse } from "../types/api";
import { getToken } from "../utils/manage-token";
import { Product } from "../types/product";
import { revalidatePath } from "next/cache";
import { getServerApiBase } from "../utils/api-response";
import { normalizeProducts } from "../utils/normalize-product";

// add product to wishlist
export async function addWishlist(fields: { productId: string }) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const response = await fetch(`${getServerApiBase()}/api/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });

  const payload: ApiResponse = await response.json().catch(() => null);

  if (!response.ok || (payload as any)?.status === false) {
    throw new Error(
      (payload as any)?.message || "Failed to add product to wishlist"
    );
  }

  revalidatePath("/", "layout");

  return payload;
}

// Delete product from wishlist.
export async function removeWishlist(productId: string) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const response = await fetch(`${getServerApiBase()}/api/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload: ApiResponse = await response.json().catch(() => null);

  if (!response.ok || (payload as any)?.status === false) {
    throw new Error(
      (payload as any)?.message || "Failed to remove product from wishlist"
    );
  }

  revalidatePath("/", "layout");

  return payload;
}

// get the full wishlist (used by the wishlist page)
export async function getWishlist(): Promise<{
  wishlist: Product[];
  message?: string;
}> {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  if (!token) return { wishlist: [] };

  const response = await fetch(`${getServerApiBase()}/api/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return { wishlist: [] };

  const payload = await response.json();

  // New backend envelope: { status, code, payload: <wishlist data> }.
  // Keeping the older fallback shapes too in case the payload nests
  // products the same way the old backend did.
  const rawWishlist =
    payload?.payload?.products ??
    payload?.payload?.wishlist?.products ??
    payload?.payload ??
    payload?.wishlist?.products ??
    payload?.data?.wishlist?.products ??
    payload?.wishlist ??
    payload?.products ??
    [];

  // Map new backend field names (id/cover/gallery/stock/...) onto what the
  // UI expects (_id/imgCover/images/quantity/...) - see normalize-product.ts.
  // Without this, ProductCard's `product._id` / `product.imgCover` come back
  // undefined for every wishlist item (broken images, "/products/undefined"
  // links, missing React keys).
  const wishlist: Product[] = normalizeProducts(
    Array.isArray(rawWishlist) ? rawWishlist : []
  );

  return { wishlist, message: payload?.message };
}

// check if product in wishlist, else.
// The new backend's Swagger doc has no "/wishlist/check/{productId}"
// endpoint - only GET /api/wishlist (full list), POST, DELETE, DELETE/{id}.
// Derived from getWishlist() instead of guessing a URL that would 404.
export async function checkWishlist(productId: string) {
  if (!productId) return false;

  const { wishlist } = await getWishlist();

  return wishlist.some((item: any) => item?.id === productId || item?._id === productId);
}
