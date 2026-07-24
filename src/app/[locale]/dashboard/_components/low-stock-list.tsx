"use client";

import { LowStockProduct } from "@/lib/types/dashboard/product";
import { cn } from "@/lib/utils/tailwind-merge";
import { useTranslations } from "next-intl";

// whether the quantity is less than 5
const getQuantityClass = (quantity: number) =>
  quantity < 5 ? "text-red-600" : "text-zinc-800 dark:text-zinc-100";

// type
type LowStockListProps = {
  products: LowStockProduct[];
};

// component
export function LowStockList({ products }: LowStockListProps) {
  // translations
  const t = useTranslations();

  return (
    <div className="flex flex-col max-h-[21.7rem] gap-2.5 overflow-y-auto hide-scrollbar w-full">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex justify-between items-center h-8 py-2 border-b border-black/5 w-full"
        >
          {/* Title */}
          <span className="text-base font-normal text-zinc-800 dark:text-zinc-100 truncate flex-1 mr-4">
            {product.title.length > 30
              ? product.title.slice(0, 28) + "..."
              : product.title}
          </span>

          {/* Quantity */}
          <span
            className={cn(
              "text-sm font-medium shrink-0",
              getQuantityClass(product.quantity)
            )}
          >
            {product.quantity} {t("low-stock.unit")}
          </span>
        </div>
      ))}
    </div>
  );
}
