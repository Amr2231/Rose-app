import OrderCard from "./order-card";
import EmptyOrders from "./empty-orders";
import { getOrders } from "@/lib/services/orders.service";

export default async function OrderList() {
  // States
  const data = await getOrders();

  if (!data?.orders?.length) return <EmptyOrders />;
  return (
    <div className="space-y-4">
      {data.orders.map((order: Order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
