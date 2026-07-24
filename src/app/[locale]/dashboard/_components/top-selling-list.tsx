"use client";

import { TopSellingProduct } from "@/lib/types/dashboard/product";
import { useTranslations, useFormatter } from "next-intl";
import { cn } from "@/lib/utils/tailwind-merge";

// get rank class
const getRankClass = (rank: number) => {
  if (rank === 1)
    return "bg-gradient-to-r from-yellow-400/25 to-yellow-400/10 font-semibold";
  if (rank === 2)
    return "bg-gradient-to-r from-slate-400/25 to-slate-400/10 font-semibold";
  if (rank === 3)
    return "bg-gradient-to-r from-orange-900/25 to-orange-900/10 font-semibold";
  return "bg-zinc-100 dark:bg-zinc-800 font-normal";
};

// type
type TopSellingListProps = {
  products: TopSellingProduct[];
};

// component
export function TopSellingList({ products }: TopSellingListProps) {
  // translations
  const t = useTranslations();
  // formatter
  const format = useFormatter();

  return (
    <div className="flex flex-col gap-2.5 max-h-[21.7rem] overflow-y-auto hide-scrollbar w-full">
      {products.map((product, index) => (
        <div
          key={product._id}
          className={cn(
            "flex items-center justify-between h-8 rounded px-2.5 py-1.5",
            getRankClass(index + 1)
          )}
        >
          {/* Title */}
          <div className="flex items-center gap-1 min-w-0 flex-1 mr-4">
            <span className="text-base text-zinc-800 dark:text-zinc-100 truncate">
              {product.title.length > 30
                ? product.title.slice(0, 28) + "..."
                : product.title}
            </span>
            {/* Price */}
            <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
              ({format.number(product.price, "currency-full")})
            </span>
          </div>

          {/* sold */}
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 shrink-0">
            {(product.sold ?? 0).toLocaleString()}{" "}
            <span className="font-medium">{t("top-selling.unit")}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
