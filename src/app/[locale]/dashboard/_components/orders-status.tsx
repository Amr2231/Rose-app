import { getOrdersStatisticsAction } from "@/lib/actions/orders.actions";
import { OrdersPieChart } from "./orders-pie-chart";

export default async function OrdersStatus() {
  const orders = await getOrdersStatisticsAction();
  const status = orders?.statistics?.ordersByStatus || [];
  return (
    <div className="w-full lg:w-1/3 lg:max-w-sm">
      <OrdersPieChart status={status} />
    </div>
  );
}
