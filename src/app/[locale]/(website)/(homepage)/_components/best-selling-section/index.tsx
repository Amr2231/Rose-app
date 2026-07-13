import React, { Suspense } from "react";
import { BestSellingCarousel } from "./best-selling-carousel";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";

export default async function BestSellingSection() {
  const t = await getTranslations("best-selling");

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">
        <div className="flex flex-col w-full lg:w-[18.5%] justify-between flex-shrink-0">
          <div>
            {/* Main headline */}
            <h2 className="text-lg font-semibold tracking-widest uppercase mb-3 text-softPink-500">
              {t("title")}
            </h2>
            <p className="text-2xl leading-none mb-1 font-bold text-maroon-600">
              <span className="text-softPink-500">
                {t("subtitle.checkOut")}
              </span>{" "}
              {t("subtitle.restBeforeBuying")}
              <span className="text-softPink-500">{t("subtitle.buying")}</span>
              {t("subtitle.rest-after-buying")}
            </p>
            <p className="text-sm text-zinc-500 p-1">{t("description")}</p>
          </div>

          <Link
            href="/products"
            className="flex gap-4 bg-maroon-600 text-white px-5 py-1 rounded-md w-fit dark:bg-softPink-300 dark:text-zinc-800 dark:hover:bg-softPink-400 transition-colors"
          >
            {t("button")}
            <ArrowRight className="w-4" />
          </Link>
        </div>

        {/* Best Selling Products Carousel */}
        <div className="w-full">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-72 w-full rounded-md" />
                <Skeleton className="h-72 w-full rounded-md" />
                <Skeleton className="h-72 w-full rounded-md" />
              </div>
            }
          >
            <BestSellingCarousel />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
