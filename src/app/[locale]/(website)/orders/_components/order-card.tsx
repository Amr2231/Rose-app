import OrderStatusBadge from "./order-status-badge";
import OrderItemsPreview from "./order-items-preview";
import OrderPaymentInfo from "./order-payment-info";
import { useTranslations, useFormatter } from "next-intl";
import { CheckCheck } from "lucide-react";

export default function OrderCard({ order }: OrderCardProps) {
  // Translation
  const t = useTranslations("orders");

  // Date formatter (next-intl)
  const format = useFormatter();

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 bg-maroon-600 text-white p-4">
        <span className="text-base sm:text-lg font-semibold">
          {t("order-number")} {order.orderNumber}
        </span>

        <span className="text-xs sm:text-sm sm:text-end">
          {t("created-at")}{" "}
          {format.dateTime(new Date(order.createdAt), {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </span>
      </header>

      {/* Body */}
      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-wrap gap-x-2 gap-y-1 items-center text-base sm:text-xl">
            <span>{t("total-price")}:</span>
            <span className="font-bold text-xl sm:text-2xl">
              {order.totalPrice} {t("currency")}
            </span>
            {order.isPaid && (
              <p className="flex justify-center items-center gap-2 w-fit px-2 py-1 rounded-full text-white text-sm capitalize bg-emerald-500">
                <CheckCheck size={16} />
                {t("paid")}
              </p>
            )}
          </div>

          <p className="flex gap-2 font-medium items-center">
            <span className="text-sm sm:text-base font-medium">
              {t("status")}:
            </span>
            <OrderStatusBadge state={order.state} />
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <OrderPaymentInfo
            paymentType={order.paymentType}
            deliveryState={order.isDelivered ? "delivered" : "pending"}
          />

          <OrderItemsPreview items={order.orderItems} />
        </div>
      </div>
    </div>
  );
}
