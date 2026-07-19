"use client";
import { useState } from "react";
import OrderItemCard from "./order-item-card";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export default function OrderItemsPreview({ items }: OrderItemsPreviewProps) {
  // Translation
  const t = useTranslations("orders");
  // States
  const [showAll, setShowAll] = useState(false);
  // Variables
  const shouldCollapse = items.length > 2;

  return (
    <>
      <p className="mb-2 font-medium dark:text-zinc-50">{t("order-items")} :</p>
      <div className="relative">
        {/* Grid Container */}
        <div
          className={clsx(
            "grid md:grid-cols-2 gap-2 overflow-hidden transition-all duration-300",
            !showAll && shouldCollapse && "max-h-64"
          )}
        >
          {items.map((item) => (
            <OrderItemCard key={item._id} item={item} />
          ))}
        </div>

        {/* Show All / Show Less */}
        {shouldCollapse && (
          <div
            className={clsx(
              "flex justify-center w-full",
              !showAll
                ? "absolute bottom-0 h-28 items-end bg-gradient-to-t from-zinc-100 via-zinc-100/80 to-transparent dark:from-zinc-800 dark:via-zinc-800/80"
                : "mt-3"
            )}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className={clsx(
                "flex flex-col items-center text-sm text-maroon-600 dark:text-softPink-300 font-medium",
                !showAll ? "mb-2" : "gap-1"
              )}
            >
              {showAll ? t("show-less") : t("show-all")}
              {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
