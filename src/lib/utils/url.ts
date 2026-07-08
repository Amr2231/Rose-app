"use client";

/**
 * Updates the URL search params and returns a string for navigation.
 * @param searchParams - Current URLSearchParams object
 * @param updates - Key-value pairs, use null to remove a param
 * @returns string to push to router (e.g., "?category=123&sort=asc")
 */

export const updateSearchParams = (
  searchParams: URLSearchParams,
  updates: Record<string, string | null>,
  options?: { resetPage?: boolean },
): string => {
  const params = new URLSearchParams(searchParams.toString());

  if (options?.resetPage) {
    params.delete("page");
  }

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "")
      params.delete(key);
    else params.set(key, value);
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};
