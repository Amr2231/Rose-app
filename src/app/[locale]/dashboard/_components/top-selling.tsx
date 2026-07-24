import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getTopSellingProducts } from "../_services/products-statistics.service";
import { TopSellingList } from "./top-selling-list";
import { TopSellingSkeleton } from "./top-selling-skeleton";

async function TopSellingContent() {
  const products = await getTopSellingProducts();
  return <TopSellingList products={products} />;
}

export default async function TopSelling() {
  // translations
  const t = await getTranslations();

  return (
    <div className="w-full  min-h-[28rem] rounded-2xl p-6 bg-white dark:bg-zinc-900 flex flex-col gap-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
        {t("top-selling.title")}
      </h2>
      <Suspense fallback={<TopSellingSkeleton />}>
        <TopSellingContent />
      </Suspense>
    </div>
  );
}
