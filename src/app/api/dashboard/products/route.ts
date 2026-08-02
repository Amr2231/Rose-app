import { NextRequest, NextResponse } from "next/server";
import { getMyToken } from "@/lib/utils/get-my-token";
import {
  DashboardProduct,
  GetProductsResponse,
} from "@/lib/types/dashboard/product.d";
import { getServerApiBase } from "@/lib/utils/api-response";
import { normalizeProduct } from "@/lib/utils/normalize-product";

// Map the shared Product normalization onto the DashboardProduct shape the
// dashboard table expects (adds __v, keeps everything else identical).
function normalizeDashboardProduct(raw: any): DashboardProduct {
  const product = normalizeProduct(raw);
  return { ...product, __v: raw?.__v ?? 0 } as DashboardProduct;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Auth
  const token = await getMyToken();
  if (!token?.accesstoken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Forward query params
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "12";

  // Fetch products
  // NOTE: the new backend's documented filters for GET /api/products are
  // page, limit, categoryId, subCategoryId, occasionId, minPrice, maxPrice,
  // minRating - there's no documented "search" param, and the new API is
  // known to reject unrecognized query params on some deployments, so it's
  // dropped here rather than forwarded blindly. If full-text search is
  // needed, confirm with the backend team whether/how it's supported.
  const url = new URL(`${getServerApiBase()}/api/products`);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token.accesstoken}` },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  // Handle errors
  if (!res.ok || data?.status === false) {
    return NextResponse.json(
      { message: data?.message ?? "Failed to fetch products" },
      { status: res.status }
    );
  }

  // New backend wraps everything in { status, code, payload }, and the
  // payload's own shape isn't guaranteed (could be a bare array, or an
  // object using products/items/data as the list key). Normalize it down
  // to the { products, metadata } contract this route promises, the same
  // way the public site's products.service.ts already does.
  const rawPayload = data?.payload ?? data;
  const rawProducts = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.products)
      ? rawPayload.products
      : Array.isArray(rawPayload?.items)
        ? rawPayload.items
        : Array.isArray(rawPayload?.data)
          ? rawPayload.data
          : [];

  const products = rawProducts.map(normalizeDashboardProduct);

  const currentPage = rawPayload?.metadata?.currentPage ?? rawPayload?.page ?? Number(page);
  const limitNum = rawPayload?.metadata?.limit ?? rawPayload?.limit ?? Number(limit);
  const totalItems =
    rawPayload?.metadata?.totalItems ?? rawPayload?.total ?? products.length;
  const totalPages =
    rawPayload?.metadata?.totalPages ??
    rawPayload?.totalPages ??
    Math.max(1, Math.ceil(totalItems / (limitNum || 1)));

  const normalized: GetProductsResponse = {
    message: data?.message ?? "",
    products,
    metadata: {
      currentPage,
      limit: limitNum,
      totalItems,
      totalPages,
    },
  };

  return NextResponse.json(normalized);
}
