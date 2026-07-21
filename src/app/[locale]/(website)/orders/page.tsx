import { Suspense } from "react";
import OrderList from "./_components/order-list";
import { useTranslations } from "next-intl";
import OrdersSkeleton from "./_components/orders-skeleton";

export default function OrdersPage() {
  // Translation
  const t = useTranslations("orders");

  return (
    <main className="px-4 sm:px-8 lg:px-16 py-8">
      <h1 className="font-bold text-2xl sm:text-4xl text-zinc-800 dark:text-zinc-50 mb-6">{t("title")}</h1>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrderList />
      </Suspense>
    </main>
  );
}
