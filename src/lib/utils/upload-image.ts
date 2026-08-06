import { getServerApiBase } from "./api-response";

export async function uploadImage(file: File, token?: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${getServerApiBase()}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    // Uploads are currently unreliable on the backend/proxy side (e.g. 413
    // from the reverse proxy's body-size limit) - append a note so users
    // aren't confused, until the backend team fixes it.
    const baseMessage = data?.message ?? "Failed to upload image";
    throw new Error(`${baseMessage} — the backend team will fix this soon.`);
  }

  const url: string | undefined = data?.payload?.url;
  if (!url) {
    throw new Error("Upload succeeded but no URL was returned");
  }

  return url;
}
