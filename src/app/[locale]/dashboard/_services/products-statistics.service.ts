import {
  LowStockProduct,
  TopSellingProduct,
} from "@/lib/types/dashboard/product";
import { getFullDashboardStatistics } from "@/lib/services/dashboard-statistics.service";

// Backed by GET /api/admin/statistics (see dashboard-statistics.service.ts
// for the normalizer / field-name assumptions - the pasted Swagger doc
// didn't include the response schema).

// get low stock
export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const data = await getFullDashboardStatistics({ lowStockThreshold: 20, lowStockLimit: 20 });
  return data?.products.lowStockProducts ?? [];
}

// get top selling
export async function getTopSellingProducts(): Promise<TopSellingProduct[]> {
  const data = await getFullDashboardStatistics({ topProductsLimit: 5 });
  return data?.products.topSellingProducts ?? [];
}
