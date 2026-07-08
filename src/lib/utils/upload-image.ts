import { getServerApiBase } from "./api-response";

/**
 * NEW backend contract: images are NOT sent inline with a create/update
 * request. Instead:
 *   1. POST /api/upload (multipart, field name "image") -> stores the file
 *      in a temp cache (Redis) and returns { payload: { url } }.
 *   2. That `url` (e.g. "/api/upload/temp/<uuid>") is passed as the
 *      `image`/`photo`/`cover` string field in the actual create/update
 *      JSON request (categories, occasions, products, profile, etc).
 *   3. The temp file is deleted once used or after its TTL (~1 hour), so
 *      step 2 should happen right after step 1.
 *
 * This helper does step 1 and returns the URL to use in step 2.
 */
export async function uploadImage(
  file: File,
  token?: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${getServerApiBase()}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to upload image");
  }

  const url: string | undefined = data?.payload?.url;
  if (!url) {
    throw new Error("Upload succeeded but no URL was returned");
  }

  return url;
}
