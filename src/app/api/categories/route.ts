import { CategoriesResponse } from "@/lib/types/category";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";
import { normalizeCategories } from "@/lib/utils/normalize-category";

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10") || 10;
    const search = req.nextUrl.searchParams.get("search")?.trim() ?? "";

    // The new backend's GET /api/categories has no documented "search"
    // param and is known to reject unrecognized/empty query params (see the
    // same note in products.service.ts) - forwarding `search=` blindly was
    // causing every request to fail with 400. Only forward params the
    // backend actually understands, and when the user is searching, fetch
    // a larger page and filter/paginate it here instead.
    const backendParams = new URLSearchParams();
    if (search) {
      // Pull a big-enough page to search across, since we can't ask the
      // backend to filter for us.
      backendParams.set("page", "1");
      backendParams.set("limit", "1000");
    } else {
      backendParams.set("page", String(page));
      backendParams.set("limit", String(limit));
    }

    const res = await fetch(
      `${getServerApiBase()}/api/categories?${backendParams.toString()}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.status === false) {
      return NextResponse.json(
        { message: data?.message ?? "Failed to fetch categories" },
        { status: res.status }
      );
    }

    // New backend wraps everything in { status, code, payload }. Normalize
    // down to the { message, metadata, categories } shape callers expect.
    const rawPayload = data?.payload ?? data;
    const rawCategories = Array.isArray(rawPayload)
      ? rawPayload
      : Array.isArray(rawPayload?.categories)
        ? rawPayload.categories
        : Array.isArray(rawPayload?.items)
          ? rawPayload.items
          : Array.isArray(rawPayload?.data)
            ? rawPayload.data
            : [];

    let normalizedCategories = normalizeCategories(rawCategories);
    let metadata = rawPayload?.metadata ?? {
      currentPage: rawPayload?.page ?? 1,
      limit: rawPayload?.limit ?? normalizedCategories.length,
      totalPages: rawPayload?.totalPages ?? 1,
      totalItems: rawPayload?.total ?? normalizedCategories.length,
    };

    if (search) {
      const needle = search.toLowerCase();
      const filtered = normalizedCategories.filter((c) =>
        c.name?.toLowerCase().includes(needle)
      );
      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / limit));
      const start = (page - 1) * limit;
      normalizedCategories = filtered.slice(start, start + limit);
      metadata = { currentPage: page, limit, totalPages, totalItems };
    }

    const normalized: CategoriesResponse = {
      message: data?.message ?? "",
      metadata,
      // Map new backend field names (id/title) onto what the UI expects
      // (_id/name) - see normalize-category.ts.
      categories: normalizedCategories,
    } as CategoriesResponse;

    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
