"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DashboardOrderStatusStat } from "@/lib/types/dashboard/orders";
import { useTranslations } from "next-intl";

type OrdersPieChartProps = {
  status: DashboardOrderStatusStat[];
};

export function OrdersPieChart({ status }: OrdersPieChartProps) {
  const t = useTranslations("dashboard.ordersStatus");
  const statusMap = Object.fromEntries(status.map((s) => [s._id, s.count]));

  const chartData = [
    {
      label: t("completed"),
      value: statusMap.completed ?? 0,
      fill: "#00BC7D",
    },
    {
      label: t("inProgress"),
      value: statusMap.inProgress ?? 0,
      fill: "#2B7FFF",
    },
    {
      label: t("canceled"),
      value: statusMap.canceled ?? 0,
      fill: "#DC2626",
    },
    {
      label: t("pending"),
      value: statusMap.pending ?? 0,
      fill: "#eab308",
    },
  ];

  const totalOrders = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // Recharts draws nothing for a Pie whose slices all sum to 0 - so with
  // no orders yet, the chart area was just blank (as in the screenshot).
  // Swap in a single full gray ring as a placeholder so there's always
  // something to look at; once real orders come in, totalOrders > 0 and
  // this switches back to the actual colored breakdown automatically.
  const pieData =
    totalOrders > 0
      ? chartData
      : [{ label: "No orders yet", value: 1, fill: "#E4E4E7" }];

  const chartConfig: ChartConfig = {
    value: {
      label: "status",
    },
    Completed: {
      label: "Completed",
    },
    InProgress: {
      label: "In Progress",
    },
    Canceled: {
      label: "Canceled",
    },
    Pending: {
      label: "Pending",
    },
  };

  return (
    <Card className="flex flex-col w-full rounded-2xl">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-zinc-800 dark:text-zinc-100 text-2xl font-semibold">
          {t("title")}
        </CardTitle>
      </CardHeader>
      {/* Mobile: chart + legend side by side (matches the phone mockup).
          lg+: chart on top, legend below (matches the wider dashboard
          reference) - same data, just a different arrangement per
          breakpoint instead of two separate components. */}
      <CardContent className="flex-1 pb-4 flex flex-row lg:flex-col items-center gap-4 lg:gap-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-28 h-28 shrink-0 lg:w-full lg:h-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="label"
              innerRadius="55%"
              outerRadius="100%"
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>

        <ul className="flex-1 min-w-0 w-full lg:pt-4">
          {chartData.map((item) => (
            <li
              key={item.label}
              className="w-full flex items-center gap-2 lg:gap-2.5 text-xs sm:text-sm py-1.5"
            >
              <span
                className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.fill }}
              ></span>
              <span className="w-full flex items-center justify-between gap-2 lg:gap-4">
                <span className="font-medium truncate">{item.label}</span>
                <span className="font-bold shrink-0">
                  {item.value ?? 0} (
                  {totalOrders > 0
                    ? (((item.value ?? 0) / totalOrders) * 100).toFixed(0)
                    : 0}
                  %)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
