import { useTranslations } from "next-intl";
import React from "react";
import { useStatistics } from "../_hooks/use-get-statistics";

export default function AllCategories() {
  // translation
  const t = useTranslations();

  // hooks
  const { data, isLoading, isError } = useStatistics();


  if (isLoading) {
    return (
      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6">
        <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 pb-4">
          All Categories
        </h3>
        <div className="text-zinc-500 dark:text-zinc-400 font-medium italic">
          Loading categories...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6">
        <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 pb-4">
          All Categories
        </h3>
        <div className="text-red-500 font-medium">Error fetching data</div>
      </div>
    );
  }

  const categoriesList: Category[] = data?.statistics.categories || [];

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 mb-4 rounded-xl  overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="p-6 pt-2 pb-4 sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">All Categories</h3>
      </div>

      {/* Categories List */}
      <div className="px-6 pb-4">
        {categoriesList.length > 0 ? (
          categoriesList.map((category) => (
            <div
              key={category?._id || Math.random()}
              className="flex justify-between py-3 border-b border-black/10 last:border-0"
            >
              <span className="text-zinc-800 dark:text-zinc-100">{category?.name}</span>

              <span className="bg-black/5 text-zinc-700 dark:text-zinc-200 px-3 py-1 rounded-sm text-sm font-semibold">
                {category?.totalProducts ?? 0} {t("products")}
              </span>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-zinc-400 dark:text-zinc-500">
            No categories to display
          </div>
        )}
      </div>
    </div>
  );
}
