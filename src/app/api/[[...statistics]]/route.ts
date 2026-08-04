import { NextResponse } from "next/server";
import { getFullDashboardStatistics } from "@/lib/services/dashboard-statistics.service";

// Backed by GET /api/admin/statistics (new backend, admin-only). See
// src/lib/services/dashboard-statistics.service.ts for the normalizer /
// field-name assumptions - the pasted Swagger doc didn't include the
// response schema, so paste a real response if the numbers look off.
export async function GET() {
  const statistics = await getFullDashboardStatistics();

  if (!statistics) {
    return NextResponse.json(
      { error: "Unable to load statistics" },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: "ok", statistics });
}