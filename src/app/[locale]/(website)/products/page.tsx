import { Suspense } from "react";
import ProductList from "./_components/product-list";
import ProductsSidebar from "./_components/sidebar";
import { getTranslations } from "next-intl/server";

export default async function page({
  searchParams,
}: ProductSearchParamsProps) {
  const t = await getTranslations("products-page");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 px-4 sm:px-8 lg:px-20 py-6 sm:py-10 gap-6">
      <div className="lg:col-span-3">
        <ProductsSidebar />
      </div>
      <div className="lg:col-span-9">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-68 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"
                />
              ))}
              <p className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-zinc-500 dark:text-zinc-400 py-4">
                {t("loading")}
              </p>
            </div>
          }
        >
          <ProductList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
