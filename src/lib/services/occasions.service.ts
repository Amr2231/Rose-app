import { OccasionsResponse } from "../types/occasion";
import { getServerApiBase } from "../utils/api-response";
import { normalizeOccasions } from "../utils/normalize-occasion";

export async function getOccasions(): Promise<OccasionsResponse> {
  const res = await fetch(`${getServerApiBase()}/api/occasions`);

  if (!res.ok) throw new Error("Failed to fetch occasions");
  const data = await res.json();

  // New backend wraps everything in { status, code, payload }. The exact
  // shape of a paginated payload isn't documented in the Swagger excerpt we
  // have (just "payload": "string"), so this normalizes a few likely shapes
  // down to the { message, metadata, occasions } contract the rest of the
  // app expects. Worth confirming the real shape with the backend team and
  // trimming this once confirmed.
  const rawPayload = data?.payload ?? data;
  const occasions = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.occasions)
      ? rawPayload.occasions
      : Array.isArray(rawPayload?.items)
        ? rawPayload.items
        : Array.isArray(rawPayload?.data)
          ? rawPayload.data
          : [];

  return {
    message: data?.message ?? "",
    metadata: rawPayload?.metadata ?? {
      currentPage: rawPayload?.page ?? 1,
      limit: rawPayload?.limit ?? occasions.length,
      totalPages: rawPayload?.totalPages ?? 1,
      totalItems: rawPayload?.total ?? occasions.length,
    },
    // Map new backend field names (id/title) onto what the UI expects
    // (_id/name) - see normalize-occasion.ts.
    occasions: normalizeOccasions(occasions),
  };
}
