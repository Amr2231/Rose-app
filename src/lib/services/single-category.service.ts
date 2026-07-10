import { Category } from "../types/category";
import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";
import { normalizeCategory } from "../utils/normalize-category";

export async function getCategory(id: string): Promise<Category> {
  const token = await getToken();
  const accessToken = token?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/categories/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  const data = await res.json();

  return normalizeCategory(data.payload?.category ?? data.payload ?? data.category);
}
