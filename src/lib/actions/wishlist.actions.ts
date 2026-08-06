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
      (payload as any)?.message || "Failed to add product to wishlist",
    );
  }

  revalidatePath("/", "layout");

  return payload;
}

// Delete product from wishlist.
// IMPORTANT: the path param here is the wishlist ENTRY's own id (the
// `id` field on each item returned by GET /api/wishlist), not the
// product's id - the backend replies "Wishlist item not found" if you
// send a productId instead, since it looks the id up by primary key.
// See checkWishlist() below, which resolves the entry id for a given
// product before this is called.
export async function removeWishlist(wishlistItemId: string) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const response = await fetch(
    `${getServerApiBase()}/api/wishlist/${wishlistItemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const payload: ApiResponse = await response.json().catch(() => null);

  if (!response.ok || (payload as any)?.status === false) {
    throw new Error(
      (payload as any)?.message || "Failed to remove product from wishlist",
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

  // New backend envelope: { status, code, payload: { wishlistItems: [...] } }.
  // Each item is { id, userId, productId, createdAt, product: {...} } - the
  // actual product data is nested under `.product`, not on the item itself
  // (confirmed via a raw response dump - it's neither `.data` nor a flat
  // product list like categories/occasions/products use).
  const rawPayload = payload?.payload ?? payload;
  const items = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.wishlistItems)
      ? rawPayload.wishlistItems
      : Array.isArray(rawPayload?.data)
        ? rawPayload.data
        : Array.isArray(rawPayload?.products)
          ? rawPayload.products
          : [];

  const rawWishlist = items.map((item: any) => item?.product ?? item);

  // Map new backend field names (id/cover/gallery/stock/...) onto what the
  // UI expects (_id/imgCover/images/quantity/...) - see normalize-product.ts.
  // Without this, ProductCard's `product._id` / `product.imgCover` come back
  // undefined for every wishlist item (broken images, "/products/undefined"
  // links, missing React keys).
  const wishlist: Product[] = normalizeProducts(
    Array.isArray(rawWishlist) ? rawWishlist : [],
  );

  return { wishlist, message: payload?.message };
}

// check if product in wishlist, and resolve the wishlist entry's own id.
// The new backend's Swagger doc has no "/wishlist/check/{productId}"
// endpoint - only GET /api/wishlist (full list), POST, DELETE /{id}.
// The entry id (returned here as wishlistItemId) is what DELETE /{id}
// actually expects - see removeWishlist() above.
export async function checkWishlist(
  productId: string,
): Promise<{ inWishlist: boolean; wishlistItemId: string | null }> {
  if (!productId) return { inWishlist: false, wishlistItemId: null };

  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;
  if (!token) return { inWishlist: false, wishlistItemId: null };

  const response = await fetch(`${getServerApiBase()}/api/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return { inWishlist: false, wishlistItemId: null };

  const payload = await response.json().catch(() => null);
  const rawPayload = payload?.payload ?? payload;
  const items = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.wishlistItems)
      ? rawPayload.wishlistItems
      : Array.isArray(rawPayload?.data)
        ? rawPayload.data
        : Array.isArray(rawPayload?.products)
          ? rawPayload.products
          : [];

  const match = items.find((item: any) => {
    const itemProductId =
      item?.productId ?? item?.product?.id ?? item?.product?._id;
    return itemProductId === productId;
  });

  return {
    inWishlist: Boolean(match),
    wishlistItemId: match?.id ?? match?._id ?? null,
  };
}
