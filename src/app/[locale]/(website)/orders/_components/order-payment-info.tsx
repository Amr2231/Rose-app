import {
  CreditCard,
  Banknote,
  Truck,
  TriangleAlert,
  CheckCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

const paymentConfig: Record<
  PaymentType,
  { label: string; Icon: React.ElementType }
> = {
  cash: {
    label: "Cash",
    Icon: Banknote,
  },
  credit_card: {
    label: "Credit Card",
    Icon: CreditCard,
  },
};

const deliveryConfig: Record<
  DeliveryState,
  { label: string; Icon: React.ElementType; color: string }
> = {
  pending: {
    label: "Pending",
    Icon: Truck,
    color: "text-yellow-600",
  },
  cancelled: {
    label: "Canceled",
    Icon: TriangleAlert,
    color: "text-maroon-500",
  },
  delivered: {
    label: "Delivered",
    Icon: CheckCheck,
    color: "text-emerald-600",
  },
};

export default function OrderPaymentInfo({
  paymentType,
  deliveryState,
}: {
  paymentType: PaymentType;
  deliveryState: DeliveryState;
}) {
  // Translation
  const t = useTranslations("orders");
  const payment = paymentConfig[paymentType];
  const delivery = deliveryConfig[deliveryState];

  return (
    <div className="text-sm dark:text-zinc-50">
      {/* Payment Method */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{t("payment.method")}:</span>

        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
          <payment.Icon size={16} />
          <span>{t(`payment.${paymentType}`)}</span>
        </div>
      </div>

      {/* Delivery Status */}
      <div className="flex items-center gap-2 mt-1">
        <span className="font-medium">{t("delivery.status")}:</span>

        <div className={`flex items-center gap-1 ${delivery.color}`}>
          <delivery.Icon size={16} />
          <span>{t(`delivery.${deliveryState}`)}</span>
        </div>
      </div>
    </div>
  );
}
