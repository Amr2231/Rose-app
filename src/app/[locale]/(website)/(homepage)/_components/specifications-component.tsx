import { Truck, ShieldCheck, RefreshCcw, Headset } from "lucide-react";
import { useTranslations } from "next-intl";

// component
export default function SpecificationsComponent() {
  const t = useTranslations("home.specifications");

  const specs = [
    {
      icon: <Truck size={40} strokeWidth={1.5} />,
      title: t("freeDelivery.title"),
      sub: t("freeDelivery.sub"),
    },
    {
      icon: <RefreshCcw size={40} strokeWidth={1.5} />,
      title: t("getRefund.title"),
      sub: t("getRefund.sub"),
    },
    {
      icon: <ShieldCheck size={40} strokeWidth={1.5} />,
      title: t("safePayment.title"),
      sub: t("safePayment.sub"),
    },
    {
      icon: <Headset size={40} strokeWidth={1.5} />,
      title: t("support.title"),
      sub: t("support.sub"),
    },
  ];

  return (
    <section className="w-full">
      <div className="bg-[#FDF0F0] dark:bg-zinc-700 rounded-xl p-5 sm:p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 w-full">
        {specs.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 w-fit lg:px-8 lg:flex-1"
          >
            <div className="w-16 h-16 bg-[#A12525] dark:bg-pink-200 dark:text-red-900 rounded-full flex items-center justify-center text-white ">
              {item.icon}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-[#A12525] dark:text-pink-200 text-xl">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-300">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
