"use client";

import {
  Box,
  ClipboardList,
  CircleDollarSign,
  ReceiptText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useStatistics } from "../_hooks/use-get-statistics";
import AllCategories from "./all-categories";

export default function DashboardStats() {
  //translation
  const t = useTranslations();

  //hooks
  const { data, error } = useStatistics();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-4 w-full max-w-[490px] h-[300px] text-red-500 font-medium">
        {t("error")}
      </div>
    );
  }

  const { overall } = data.statistics;

  // Card backgrounds used to be solid pastel fills (bg-maroon-50,
  // bg-blue-50, bg-emerald-50...) which only look right in light mode -
  // in dark mode `maroon-50` itself flips to a dark tone (by design, via
  // CSS var) while blue-50/emerald-50 stay light, so cards ended up an
  // inconsistent mix of "too dark to read" and "too light against a dark
  // page". Using a translucent tint of the accent color instead means the
  // card always blends with whatever the page background is (light or
  // dark), so one text color pairing works everywhere.
  const statsConfig = [
    {
      title: "Total products",
      value: overall.totalProducts,
      icon: <Box size={35} className="text-maroon-600" />,
      textColor: "text-maroon-600",
      bgColor: "bg-maroon-600/10",
    },
    {
      title: "Total orders",
      value: overall.totalOrders,
      icon: (
        <ReceiptText size={35} className="text-blue-600 dark:text-blue-400" />
      ),
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-600/10",
    },
    {
      title: "Total categories",
      value: overall.totalCategories,
      icon: <ClipboardList size={35} className="text-[#8B5CF6]" />,
      textColor: "text-[#8B5CF6]",
      bgColor: "bg-[#8B5CF6]/10",
    },
    {
      title: "Total revenue",
      value: overall.totalRevenue.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      unit: t("product.currency"),
      icon: (
        <CircleDollarSign
          size={35}
          className="text-emerald-600 dark:text-emerald-400"
        />
      ),
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-600/10",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:h-80 gap-6 w-full">
      <div className="grid grid-cols-2 gap-y-4 gap-x-3 p-4 w-full lg:max-w-[490px]">
        {statsConfig.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} p-4 rounded-md flex flex-col w-full `}
          >
            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2`}
            >
              {item.icon}
            </div>

            {/* Text Content */}
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-semibold tracking-tight ${item.textColor}`}
                >
                  {item.value}
                </span>
                {item.unit && (
                  <span className={`font-bold ${item.textColor} opacity-90`}>
                    {item.unit}
                  </span>
                )}
              </div>
              {/* Now that the card background is a translucent tint that
                blends with the page (light or dark), the title needs the
                usual dual-tone pairing again to stay readable in both. */}
              <p className="text-zinc-800 dark:text-zinc-100 font-medium mt-1">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <AllCategories />
    </div>
  );
}
