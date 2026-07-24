"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  DashboardDailyRevenueStat,
  DashboardMonthlyRevenueStat,
} from "@/lib/types/dashboard/orders";
import { cn } from "@/lib/utils/tailwind-merge";
import { useFormatter, useTranslations } from "next-intl";

type RevenueChartProps = {
  dailyRevenue: DashboardDailyRevenueStat[];
  monthlyRevenue: DashboardMonthlyRevenueStat[];
};

const chartConfig = {
  revenue: {
    label: "EGP",
    color: "#A6252A80",
  },
} satisfies ChartConfig;

export function RevenueChart({
  dailyRevenue,
  monthlyRevenue,
}: RevenueChartProps) {
  const t = useTranslations();
  const [view, setView] = useState<"daily" | "monthly">("monthly");
  const format = useFormatter();

  // Choose data based on view. When the backend has no revenue rows yet
  // (new store / no orders), fall back to a flat zero-revenue series over
  // the same time window so the chart shell (grid, axes) still shows -
  // matching the "let me see it even with no data, and it'll sort itself
  // out once there is data" request - instead of hiding the whole chart
  // behind a text message.
  const buildPlaceholderMonthly = () => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return { label: date.toLocaleString("en-US", { month: "short" }), revenue: 0 };
    });
  };

  const buildPlaceholderDaily = () => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
      return { label: date.toLocaleString("en-US", { weekday: "short" }), revenue: 0 };
    });
  };

  const data =
    view === "daily"
      ? dailyRevenue && dailyRevenue.length > 0
        ? dailyRevenue
            .map((item) => {
              const [year, month, day] = item._id.split("-");
              const date = new Date(Number(year), Number(month) - 1, Number(day));
              return {
                label: `${date.toLocaleString("en-US", { weekday: "short" })}`,
                revenue: item.revenue,
              };
            })
            .reverse()
        : buildPlaceholderDaily()
      : monthlyRevenue && monthlyRevenue.length > 0
        ? monthlyRevenue
            .map((item) => {
              const [year, month] = item._id.split("-");
              const date = new Date(Number(year), Number(month) - 1);
              return { label: date.toLocaleString("en-US", { month: "short" }), revenue: item.revenue };
            })
            .reverse()
        : buildPlaceholderMonthly();

  const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));

  return (
    <Card className="w-full lg:max-w-[49rem] h-96 mx-auto my-5 border-none shadow-sm">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex justify-between ">
          <h2 className="text-2xl font-bold">{t("revenue")}</h2>
          {/* Toggle Buttons */}
          <div className="flex text-sm">
            <p
              className={cn(
                "px-3 py-1 rounded cursor-pointer ",
                view === "monthly"
                  ? "text-maroon-600 font-bold"
                  : "text-[#969696]"
              )}
              onClick={() => setView("monthly")}
            >
              {t("monthly")}
            </p>
            <p
              className={cn(
                "px-3 py-1 rounded cursor-pointer ",
                view === "daily"
                  ? "text-maroon-600 font-bold"
                  : "text-[#969696]"
              )}
              onClick={() => setView("daily")}
            >
              {t("last-week")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-72 w-full" config={chartConfig}>
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            {/* Define gradient */}
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A6252A" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#F8B1EF00" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={true}
              horizontal={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontWeight: 600 }}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontWeight: 600, fill: "Red" }}
              tickFormatter={(value: number) =>
                format.number(value, {
                  style: "currency",
                  currency: "EGP",
                })
              }
              domain={[0, maxRevenue * 1.1]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              stroke="#A6252A"
              fill="url(#revenueGradient)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
