// 1. تفاصيل الكاتيجوري
declare interface Category {
  _id: string;
  name: string;
  totalProducts: number;
  totalRevenue: number;
}

declare interface OverallStats {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  totalRevenue: number;
}

declare interface FullStatisticsData {
  overall: OverallStats;
  products: {
    productsByCategory: any[];
    topSellingProducts: any[];
    lowStockProducts: any[];
  };
  orders: {
    ordersByStatus: any[];
    dailyRevenue: any[];
    monthlyRevenue: any[];
  };
    categories: Category[];
}

declare interface StatisticsResponse {
  message: string;
  statistics: FullStatisticsData;
}