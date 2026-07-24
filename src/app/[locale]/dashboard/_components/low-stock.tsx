import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getLowStockProducts } from "../_services/products-statistics.service";
import { LowStockList } from "./low-stock-list";
import { LowStockSkeleton } from "./low-stock-skeleton";

async function LowStockContent() {
  const products = await getLowStockProducts();
  return <LowStockList products={products} />;
}

export default async function LowStock() {
  // translations
  const t = await getTranslations();

  return (
    <div className="w-full  min-h-[28rem] rounded-2xl p-6 bg-white dark:bg-zinc-900 flex flex-col gap-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
        {t("low-stock.title")}
      </h2>
      {/* loading */}
      <Suspense fallback={<LowStockSkeleton />}>
        <LowStockContent />
      </Suspense>
    </div>
  );
}
