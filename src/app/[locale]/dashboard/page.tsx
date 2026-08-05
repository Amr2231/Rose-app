
import OrdersStatus from "./_components/orders-status";
import Revenue from "./_components/revenue";
import DashboardStats from "./_components/statistics";
import TopSelling from "./_components/top-selling";
import LowStock from "./_components/low-stock";

export default function page() {
  return (
    <div className="">
      <div className="flex flex-col items-center p-2 gap-6">
        <DashboardStats/>
        <div className="flex flex-col lg:flex-row items-center mt-2 gap-6 w-full">
          <OrdersStatus />
          <Revenue />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-6 pb-3">
        <TopSelling></TopSelling>
        <LowStock></LowStock>
      </div>
    </div>
  );
}
