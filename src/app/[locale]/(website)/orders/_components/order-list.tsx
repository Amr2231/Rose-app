import OrderCard from "./order-card";
import EmptyOrders from "./empty-orders";
import { getOrders } from "@/lib/services/orders.service";

export default async function OrderList() {
  // States
  let data;
  try {
    data = await getOrders();
  } catch (error) {
    // e.g. Admin accounts hitting the customer-only /api/orders endpoint -
    // don't crash the whole page (which was bubbling up to the global
    // error boundary), just show the empty state instead.
    console.error("Failed to load orders:", error);
    return <EmptyOrders />;
  }

  if (!data?.orders?.length) return <EmptyOrders />;
  return (
    <div className="space-y-4">
      {data.orders.map((order: Order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
