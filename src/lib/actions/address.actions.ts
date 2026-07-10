"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";
import { getServerApiBase } from "../utils/api-response";

//  Utilities

/**
 * Get access token from NextAuth session
 */
async function getAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  // check if user is authenticated
  const token =
    (session as any)?.user?.accesstoken || (session as any)?.accesstoken;

  return token ?? null;
}

/**
 * Generic API request helper
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // get access token
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }

  // make request - endpoint should start with "/api/..."
  const res = await fetch(`${getServerApiBase()}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  // handle errors
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText || res.statusText}`);
  }

  return res;
}

/**
 * Revalidate pages after mutation
 */
function revalidateAddresses() {
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
  revalidatePath("/addresses");
}

/**
 * The address form keeps latitude/longitude as strings (they're bound to
 * text/map inputs), but the backend validates them as numbers - sending
 * "30.0444" as a string fails with "expected number, received string".
 * Coerce them here, right before the request, so callers/forms don't have
 * to worry about it.
 */
function normalizeAddressPayload(data: any) {
  const payload = { ...data };

  if (payload.latitude !== undefined) {
    payload.latitude = Number(payload.latitude);
  }
  if (payload.longitude !== undefined) {
    payload.longitude = Number(payload.longitude);
  }

  return payload;
}

//  Get addresses
export async function getAddressesAction() {
  try {
    // guests have no addresses to fetch - skip the request entirely
    // instead of hitting the API and logging an expected 401
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    const res = await apiRequest("/api/addresses", {
      method: "GET",
    });

    const data = await res.json();

    // Same shape problem as occasions/products: the new backend wraps
    // paginated lists as { status, code, payload: { addresses/items/data, metadata } }
    // rather than handing back a bare array in `payload`. Previously this
    // only checked `data?.payload` directly, so a wrapped payload silently
    // fell through to `[]` - e.g. after successfully adding an address,
    // the list would still show "No saved addresses yet".
    const rawPayload = data?.payload ?? data?.addresses ?? data;

    const addresses = Array.isArray(rawPayload)
      ? rawPayload
      : Array.isArray(rawPayload?.addresses)
        ? rawPayload.addresses
        : Array.isArray(rawPayload?.items)
          ? rawPayload.items
          : Array.isArray(rawPayload?.data)
            ? rawPayload.data
            : [];

    return addresses;
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return [];
  }
}

//  Add address
// NOTE: this was a PATCH to /addresses, which isn't even a valid create
// call - the new backend (and REST conventions generally) use POST to
// create a resource on the collection endpoint.
export async function addAddressAction(data: any) {
  try {
    await apiRequest("/api/addresses", {
      method: "POST",
      body: JSON.stringify(normalizeAddressPayload(data)),
    });

    revalidateAddresses();

    return { success: true };
  } catch (error) {
    console.error("Add address failed:", error);
    throw error;
  }
}

//  Update address
export async function updateAddressAction(id: string, data: any) {
  try {
    await apiRequest(`/api/addresses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(normalizeAddressPayload(data)),
    });

    revalidateAddresses();

    return { success: true };
  } catch (error) {
    console.error("Update address failed:", error);
    throw error;
  }
}

//  Delete address
export async function deleteAddressAction(id: string) {
  try {
    await apiRequest(`/api/addresses/${id}`, {
      method: "DELETE",
    });

    revalidateAddresses();

    return { success: true };
  } catch (error) {
    console.error("Delete address failed:", error);
    throw error;
  }
}
