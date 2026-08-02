import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// The new backend's Swagger doc has no "/statistics/orders" endpoint (no
// Statistics module at all). Rather than call a URL that will 404 on the
// new API, this now returns a clear "not available" response. Needs either
// a real statistics endpoint from the backend team, or to be computed
// client-side from GET /api/orders.
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token?.accesstoken) {
    return NextResponse.json(
      { message: "Unauthorized ❌❌" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { message: "Statistics endpoint is not available on the current API" },
    { status: 501 }
  );
}
