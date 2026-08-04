import { NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";
import { normalizeOccasions } from "@/lib/utils/normalize-occasion";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = `${getServerApiBase()}/api/occasions${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (!res.ok || data?.status === false) {
      return NextResponse.json(
        { error: "Failed to fetch from external API" },
        { status: res.status }
      );
    }

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

    return NextResponse.json({
      message: data?.message ?? "",
      metadata: rawPayload?.metadata ?? {
        currentPage: rawPayload?.page ?? 1,
        limit: rawPayload?.limit ?? occasions.length,
        totalPages: rawPayload?.totalPages ?? 1,
        totalItems: rawPayload?.total ?? occasions.length,
      },
      // Map the new backend's field names (id/title) onto what the UI
      // expects (_id/name) - see normalize-occasion.ts. This route was
      // returning the raw {id, title} shape, so every consumer reading
      // occasion._id/occasion.name (the sidebar filter, the homepage
      // tabs, etc.) got `undefined` for both - which meant filter clicks
      // were pushing `?occasion=undefined` (the literal string) to the
      // URL instead of a real id.
      occasions: normalizeOccasions(occasions),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
