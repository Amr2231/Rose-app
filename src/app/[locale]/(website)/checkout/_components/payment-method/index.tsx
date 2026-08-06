import React from "react";
import { ArrowLeft, MoveRight } from "lucide-react";
import PayMethod from "./pay-method";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";

type PaymentMethodComponentProps = PaymentMethodProps;
export default function PaymentMethod({
  setStep,
  id,
}: PaymentMethodComponentProps) {
  // translation
  const t = useTranslations("payment-method");
  // state
  const [selectedMethod, setSelectedMethod] =
    React.useState<PaymentType>("cash");

  const list: {
    image: string;
    title: string;
    description: string;
    method: PaymentType;
  }[] = [
    {
      image: "/assets/cash.png",
      title: t("cash"),
      description: t("cash-description"),
      method: "cash",
    },
    {
      image: "/assets/credit.png",
      title: t("card"),
      description: t("card-description"),
      method: "credit_card",
    },
  ];

  const { checkout, isPending } = useCheckout();

  const handleCheckout = () => {
    // NEW backend contract: POST /api/orders body { addressId, paymentMethod }
    // - "id" here is the saved address's id (already picked in the
    // shipping-address step), not a raw street/phone/city/lat/long object.
    checkout({
      addressId: id,
      paymentMethod:
        selectedMethod === "credit_card" ? "CREDIT_CARD" : "CASH_ON_DELIVERY",
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
        <button
          onClick={() => setStep("shipping_address")}
          className="bg-zinc-100 text-zinc-00 p-2 rounded-lg flex items-center gap-1 shrink-0"
        >
          <ArrowLeft size={20} strokeWidth={1.5} className="rtl:rotate-180" />
          {t("back")}
        </button>
        <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl">
          {t("title")}
        </h3>
      </div>
      {/* Methods List */}
      <ul className="p-1 sm:p-3 flex flex-col sm:flex-row gap-4 sm:h-80">
        {list.map((item, index) => (
          <li key={index} className="flex-1 h-full">
            <button
              className="w-full h-full"
              onClick={() => setSelectedMethod(item.method)}
            >
              {selectedMethod === item.method ? (
                // if the method is selected
                <PayMethod
                  index={index}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  selectedMethod={true}
                />
              ) : (
                // if the method is not selected
                <PayMethod
                  index={index}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  selectedMethod={false}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end mt-6">
        <Button
          className="w-40 font-semibold"
          onClick={handleCheckout}
          disabled={isPending}
        >
          {isPending ? t("processing") : t("checkout")}
          <MoveRight size={20} className="rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
