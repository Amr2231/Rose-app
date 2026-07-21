import { useTranslations } from "next-intl";

const statusStyles: Record<OrderState, string> = {
  pending: "bg-blue-500",
  inProgress: "bg-amber-500",
  done: "bg-emerald-500",
  cancelled: "bg-red-600",
};

export default function OrderStatusBadge({ state }: OrderStatusBadgeProps) {
  // Translation
  const t = useTranslations("orders");
  // fall back gracefully for any state value the backend adds later that
  // isn't translated/styled yet, instead of crashing the page
  const hasTranslation = t.has(`order-status.${state}`);

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-sm capitalize ${
        statusStyles[state] ?? "bg-zinc-500"
      }`}
    >
      {hasTranslation ? t(`order-status.${state}`) : state}
    </span>
  );
}
