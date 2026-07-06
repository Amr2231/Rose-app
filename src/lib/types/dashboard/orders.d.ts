export type DashboardStatisticsResponse = {
  message: string;
  statistics: {
    ordersByStatus: DashboardOrderStatusStat[];
    dailyRevenue: DashboardDailyRevenueStat[];
    monthlyRevenue: DashboardMonthlyRevenueStat[];
  };
};

export type DashboardOrderStatusStat = {
  _id: "completed" | "inProgress" | "canceled" | "pending" | null;
  count: number;
};

export type DashboardDailyRevenueStat = {
  _id: string;
  revenue: number;
  count: number;
};

export type DashboardMonthlyRevenueStat = {
  _id: string;
  revenue: number;
  count: number;
};
