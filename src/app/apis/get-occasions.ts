import { OccasionsResponse } from "@/lib/types/occasion";

export async function getOccasions(
  params: Record<string, string> = {},
): Promise<OccasionsResponse> {
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/occasions${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch occasions from API route");
  }

  return res.json();
}
