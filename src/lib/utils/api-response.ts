/**
 * Shared helpers for talking to the NEW backend, which always responds with
 * the same envelope shape:
 *
 *   { "status": true, "code": 0, "message": "string", "payload": <T> }
 *
 * Use `parseApiEnvelope<T>(response)` after every fetch call to the new API.
 * It throws a plain `Error` (with the backend's `message`) on failure, so it
 * plugs directly into React Query's `onError` / `error` state.
 */

export type ApiEnvelope<T = unknown> = {
  status: boolean;
  code: number;
  message?: string;
  payload?: T;
};

export async function parseApiEnvelope<T = unknown>(
  response: Response
): Promise<T> {
  let json: ApiEnvelope<T> | null = null;

  try {
    json = await response.json();
  } catch {
    // Body wasn't JSON (e.g. empty 204 response) - fall through below.
  }

  if (!response.ok || !json || json.status === false) {
    const message =
      json?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json.payload as T;
}

/**
 * Base URL helpers.
 *
 * IMPORTANT (env var change vs the old backend):
 * The new API's routes already include the `/api` prefix
 * (e.g. `/api/auth/login`), so the base URL env vars below should be the
 * bare origin only - WITHOUT `/api` at the end.
 *
 *   API=https://your-new-backend.com                (server-side only)
 *   NEXT_PUBLIC_API=https://your-new-backend.com     (exposed to the client)
 */
export function getServerApiBase() {
  const base = process.env.API;
  if (!base) {
    throw new Error("Missing API environment variable");
  }
  return base.replace(/\/$/, "");
}

export function getClientApiBase() {
  const base = process.env.NEXT_PUBLIC_API;
  if (!base) {
    throw new Error("Missing NEXT_PUBLIC_API environment variable");
  }
  return base.replace(/\/$/, "");
}
