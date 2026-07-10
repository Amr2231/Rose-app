"use server";

import { DashboardStatisticsResponse } from "../types/dashboard/orders";
import { getFullDashboardStatistics } from "../services/dashboard-statistics.service";

// Backed by GET /api/admin/statistics (see dashboard-statistics.service.ts
// for the normalizer / field-name assumptions - the pasted Swagger doc
// didn't include the response schema).
export async function getOrdersStatisticsAction(): Promise<
  DashboardStatisticsResponse | undefined
> {
  const data = await getFullDashboardStatistics();
  if (!data) return undefined;

  return {
    message: "ok",
    statistics: data.orders,
  };
}
