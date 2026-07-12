"use client";

import { Button } from "../ui/button";
import { ArrowRight, TicketSlashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type SummaryProps = {
  /** Cart subtotal (sum of item price * quantity) */
  subtotal: number;
  /** Final total to pay. Defaults to subtotal since there's no discount/coupon logic. */
  total?: number;
  /** Show a skeleton state while cart data is still loading */
  isLoading?: boolean;
  /** Hide the "Checkout" button (e.g. when Summary is reused inside the checkout page itself) */
  showCheckoutButton?: boolean;
};

export default function Summary({
  subtotal,
  total,
  isLoading = false,
  showCheckoutButton = true,
}: SummaryProps) {
  // translation
  const t = useTranslations("summary");

  const finalTotal = total ?? subtotal;
  const isDisabled = isLoading || subtotal <= 0;

  return (
    <div>
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 dark:text-zinc-50">
        {t("title")}
      </h3>
      <div className="bg-zinc-50 dark:bg-zinc-800 p-3 sm:p-4 rounded-xl shadow-sm space-y-3">
        {/* coupon field — visual only, not wired to any backend yet */}
        <form
          className="flex gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder={t("placeholder")}
            disabled
            className="flex-1 min-w-0 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base outline-none disabled:bg-zinc-100 dark:disabled:bg-zinc-700 disabled:text-zinc-400 dark:disabled:text-zinc-500 dark:text-zinc-50"
          />
          <Button type="submit" disabled className="shrink-0">
            <TicketSlashIcon /> {t("apply")}
          </Button>
        </form>

        {/* box for showing applied coupons (always empty for now) */}
        <div className="h-24 sm:h-60 text-sm sm:text-base text-zinc-400 dark:text-zinc-500 border border-zinc-300 dark:border-zinc-600 italic flex justify-center items-center rounded-md text-center px-2">
          {t("box")}
        </div>

        {/* Totals */}
        <div className="p-2 sm:p-3 text-zinc-800 dark:text-zinc-50">
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-medium">{t("subtotal")}</p>
            <p className="text-lg sm:text-xl font-semibold">
              {isLoading ? "..." : subtotal} {t("currency")}
            </p>
          </div>

          <div className="my-3 h-0 border-t border-zinc-300 dark:border-zinc-600" />

          <div className="flex justify-between items-center text-xl sm:text-2xl font-bold">
            <p>{t("total")}</p>
            <p className="text-maroon-600">
              {isLoading ? "..." : finalTotal} {t("currency")}
            </p>
          </div>
        </div>

        {/* checkout button */}
        {showCheckoutButton && (
          <Link
            href={isDisabled ? "#" : "/checkout"}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
            className={isDisabled ? "pointer-events-none" : "block"}
          >
            <Button
              type="button"
              disabled={isDisabled}
              className="w-full capitalize"
            >
              {t("checkout")} <ArrowRight size={18} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
