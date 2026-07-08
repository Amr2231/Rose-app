"use server";

import { getServerApiBase } from "../utils/api-response";
import { getToken } from "../utils/manage-token";
import {
  DashboardDailyRevenueStat,
  DashboardMonthlyRevenueStat,
  DashboardOrderStatusStat,
} from "../types/dashboard/orders";
import { LowStockProduct, TopSellingProduct } from "../types/dashboard/product";

/**
 * Single source of truth for the dashboard's overview page.
 *
 * Backed by GET /api/admin/statistics (new backend, admin-only), which
 * replaces the old (dead) Statistics module. Query params per the Swagger
 * doc:
 *   revenuePeriod:      "monthly" (last 12 months) | "week" (last 7 days)
 *   lowStockThreshold:  max stock (inclusive) to count as low stock (default 20)
 *   topProductsLimit:   number of top-selling products (default 5, max 50)
 *   lowStockLimit:      max low-stock rows (default 20, max 100)
 *
 * NOTE: the pasted Swagger page didn't include the actual response body
 * schema (it cuts off right after "200 - Dashboard payload"), so the exact
 * field names below are a best guess based on REST/dashboard conventions
 * and what the existing UI (revenue chart, orders pie chart, top-selling /
 * low-stock lists, stat cards) needs. Every field is read defensively with
 * a few likely aliases. If the real payload differs, this is the ONLY file
 * that needs adjusting - paste me one real response and I'll tighten it.
 */

type RevenuePeriod = "monthly" | "week";

async function fetchAdminStatistics(
  period: RevenuePeriod,
  token: string | undefined,
  opts: { lowStockThreshold?: number; topProductsLimit?: number; lowStockLimit?: number }
): Promise<any | null> {
  if (!token) return null;

  const params = new URLSearchParams({ revenuePeriod: period });
  if (opts.lowStockThreshold != null)
    params.set("lowStockThreshold", String(opts.lowStockThreshold));
  if (opts.topProductsLimit != null)
    params.set("topProductsLimit", String(opts.topProductsLimit));
  if (opts.lowStockLimit != null)
    params.set("lowStockLimit", String(opts.lowStockLimit));

  const res = await fetch(
    `${getServerApiBase()}/api/admin/statistics?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const json = await res.json().catch(() => null);
  if (!json || json.status === false) return null;

  return json.payload ?? json;
}

// ---------------------------------------------------------------------------
// Normalizers - defensive field-name coalescing (see NOTE above)
// ---------------------------------------------------------------------------

function normalizeOverall(raw: any): OverallStats {
  const overall = raw?.overall ?? raw?.summary ?? raw ?? {};
  return {
    totalProducts: overall.totalProducts ?? overall.productsCount ?? 0,
    totalOrders: overall.totalOrders ?? overall.ordersCount ?? 0,
    totalCategories: overall.totalCategories ?? overall.categoriesCount ?? 0,
    totalRevenue: overall.totalRevenue ?? overall.revenue ?? 0,
  };
}

function normalizeCategories(raw: any): Category[] {
  const list = raw?.categories ?? raw?.categoryBreakdown ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((c: any) => ({
    _id: c._id ?? c.id ?? "",
    name: c.name ?? c.title ?? "",
    totalProducts: c.totalProducts ?? c.productsCount ?? 0,
    totalRevenue: c.totalRevenue ?? c.revenue ?? 0,
  }));
}

// New backend's order status enum (per the Auth/Orders Swagger doc):
// PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED.
// The pie chart UI only has 4 buckets, so real statuses are grouped into
// them here rather than reworking the chart.
function bucketForStatus(status: string): DashboardOrderStatusStat["_id"] {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
    case "PROCESSING":
    case "SHIPPED":
      return "inProgress";
    case "DELIVERED":
      return "completed";
    case "CANCELLED":
    case "REFUNDED":
      return "canceled";
    default:
      return null;
  }
}

function normalizeOrdersByStatus(raw: any): DashboardOrderStatusStat[] {
  const list = raw?.ordersByStatus ?? raw?.orderStatusBreakdown ?? raw?.ordersByStatusCount ?? [];
  if (!Array.isArray(list)) return [];

  const buckets: Record<string, number> = {
    completed: 0,
    inProgress: 0,
    canceled: 0,
    pending: 0,
  };

  for (const item of list) {
    const rawStatus = item._id ?? item.status ?? "";
    const count = item.count ?? item.total ?? 0;
    // Already-bucketed (old style) - use as-is if it matches a known bucket.
    if (rawStatus in buckets) {
      buckets[rawStatus] += count;
      continue;
    }
    const bucket = bucketForStatus(rawStatus);
    if (bucket) buckets[bucket] += count;
  }

  return Object.entries(buckets).map(([_id, count]) => ({
    _id: _id as DashboardOrderStatusStat["_id"],
    count,
  }));
}

function normalizeRevenue(
  raw: any
): { revenue: number; count: number; _id: string }[] {
  const list = raw?.revenue ?? raw?.revenueChart ?? raw?.revenueSeries ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((item: any) => ({
    _id: item._id ?? item.period ?? item.date ?? item.label ?? "",
    revenue: item.revenue ?? item.total ?? item.amount ?? 0,
    count: item.count ?? item.orders ?? item.orderCount ?? 0,
  }));
}

function normalizeTopSelling(raw: any): TopSellingProduct[] {
  const list = raw?.topProducts ?? raw?.topSellingProducts ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((p: any) => ({
    _id: p._id ?? p.id ?? p.productId ?? "",
    title: p.title ?? "",
    imgCover: p.imgCover ?? p.cover ?? p.image ?? "",
    price: p.price ?? 0,
    sold: p.sold ?? p.totalSold ?? p.unitsSold ?? 0,
  }));
}

function normalizeLowStock(raw: any): LowStockProduct[] {
  const list = raw?.lowStockProducts ?? raw?.lowStock ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((p: any) => ({
    _id: p._id ?? p.id ?? p.productId ?? "",
    title: p.title ?? "",
    imgCover: p.imgCover ?? p.cover ?? p.image ?? "",
    price: p.price ?? 0,
    quantity: p.quantity ?? p.stock ?? 0,
  }));
}

export type DashboardStatisticsOptions = {
  lowStockThreshold?: number;
  topProductsLimit?: number;
  lowStockLimit?: number;
};

/**
 * Fetches everything the dashboard overview page needs in one place.
 * Two backend calls are made in parallel (one per `revenuePeriod`) so the
 * revenue chart can keep its existing client-side monthly/weekly toggle
 * without refetching.
 */
export async function getFullDashboardStatistics(
  options: DashboardStatisticsOptions = {}
): Promise<FullStatisticsData | null> {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken as string | undefined;

  if (!token) return null;

  const [monthlyRaw, weekRaw] = await Promise.all([
    fetchAdminStatistics("monthly", token, options),
    fetchAdminStatistics("week", token, options),
  ]);

  if (!monthlyRaw) return null;

  const monthlyRevenue = normalizeRevenue(
    monthlyRaw
  ) as DashboardMonthlyRevenueStat[];
  const dailyRevenue = (
    weekRaw ? normalizeRevenue(weekRaw) : []
  ) as DashboardDailyRevenueStat[];

  return {
    overall: normalizeOverall(monthlyRaw),
    products: {
      productsByCategory: [],
      topSellingProducts: normalizeTopSelling(monthlyRaw),
      lowStockProducts: normalizeLowStock(monthlyRaw),
    },
    orders: {
      ordersByStatus: normalizeOrdersByStatus(monthlyRaw),
      dailyRevenue,
      monthlyRevenue,
    },
    categories: normalizeCategories(monthlyRaw),
  };
}
