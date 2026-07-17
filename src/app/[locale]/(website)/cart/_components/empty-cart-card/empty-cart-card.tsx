"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { BrushCleaning, MoveLeft } from "lucide-react";

export type EmptyCartCardProps = {
  productCount: number;
  className?: string;
};

export default function EmptyCartCard({
  productCount,
  className = "",
}: EmptyCartCardProps) {
  const t = useTranslations("cart");

  return (
    <div
      className={`w-full lg:max-w-[48rem] my-10 px-4 py-2 rounded-2xl ${className}`.trim()}
    >
      <div className="cart-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 w-full">
        <div className="text-2xl sm:text-3xl lg:text-5xl text-zinc-800 dark:text-zinc-50 dark:bg-zinc-800 font-bold">
          {t("title")}
          <span className="text-zinc-500 dark:text-zinc-400 font-normal text-sm sm:text-base ms-2">
            {productCount} {t("products")}
          </span>
        </div>
        <div className="clear">
          <Button disabled className="capitalize">
            <BrushCleaning size={20} /> {t("empty")}
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardContent>
          <Image
            src="/assets/p0.png"
            alt="No products"
            width={250}
            height={214}
            className="mx-auto"
          />
          <p className="text-sm font-normal text-zinc-400 dark:text-zinc-500">{t("empty-cart")}</p>
        </CardContent>
      </Card>

      <div className="text-start py-6 w-full">
        <Button variant="destructive" className="capitalize">
          <MoveLeft size={20} />
          <Link href="/">{t("continue-shopping")}</Link>
        </Button>
      </div>
    </div>
  );
}
