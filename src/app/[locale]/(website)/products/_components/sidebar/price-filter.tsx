"use client";

import { useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  PriceFormValues,
  priceSchema,
} from "@/lib/schemas/products-filter.schema";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { updateSearchParams } from "@/lib/utils/url";

const PriceFilter = forwardRef((_, ref) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("price-filter");

  const currentMin = searchParams.get("minPrice") || "";
  const currentMax = searchParams.get("maxPrice") || "";

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      minPrice: currentMin,
      maxPrice: currentMax,
    },
  });

  useEffect(() => {
    reset({
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    });
  }, [searchParams, reset]);

  useImperativeHandle(ref, () => ({
    resetLocal: () => reset({ minPrice: "", maxPrice: "" }),
  }));

  const watchedValues = watch();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (errors.minPrice || errors.maxPrice) return;

      const nextMin = watchedValues.minPrice || "";
      const nextMax = watchedValues.maxPrice || "";
      const currentQuery = searchParams.toString();

      const params = new URLSearchParams(currentQuery);
      params.delete("page");

      if (nextMin) params.set("minPrice", nextMin);
      else params.delete("minPrice");

      if (nextMax) params.set("maxPrice", nextMax);
      else params.delete("maxPrice");

      const nextQuery = params.toString();
      if (nextQuery === currentQuery) return;

      const newUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.push(newUrl, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [
    watchedValues.minPrice,
    watchedValues.maxPrice,
    errors.minPrice,
    errors.maxPrice,
    router,
    pathname,
    searchParams,
  ]);

  const handleReset = () => {
    reset({ minPrice: "", maxPrice: "" });
    const newUrl = updateSearchParams(
      searchParams,
      { minPrice: null, maxPrice: null },
      { resetPage: true },
    );
    router.push(`${pathname}${newUrl}`, { scroll: false });
  };

  return (
    <div className="space-y-4 py-6 border-t border-zinc-100 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">{t("title")}</h3>
        {(watchedValues.minPrice || watchedValues.maxPrice) && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-red-600 text-md cursor-pointer"
          >
            <X size={20} /> {t("reset")}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-1.5">
          <label className="text-sm text-zinc-600 dark:text-zinc-400 ml-1">{t("from")}</label>
          <Input
            {...register("minPrice")}
            placeholder="0"
            className={cn(
              "h-12 rounded-xl border-zinc-200 focus:ring-maroon-800",
              errors.minPrice && "border-red-500",
            )}
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <label className="text-sm text-zinc-600 dark:text-zinc-400 ml-1">{t("to")}</label>
          <Input
            {...register("maxPrice")}
            placeholder="1000000"
            className={cn(
              "h-12 rounded-xl border-zinc-200 focus:ring-maroon-800",
              errors.maxPrice && "border-red-500",
            )}
          />
        </div>
      </div>

      {errors.maxPrice && (
        <p className="text-[10px] text-red-500 mt-1 italic font-medium">
          {errors.maxPrice.message}
        </p>
      )}
    </div>
  );
});

PriceFilter.displayName = "PriceFilter";
export default PriceFilter;
