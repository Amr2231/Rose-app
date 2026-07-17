"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSearchParams } from "next/navigation";
import { updateSearchParams } from "@/lib/utils/url";
import { Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const MAX_RATING = 5;

const RatingFilter = forwardRef((props, ref) => {
  const t = useTranslations("rating-filter");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rateParam = searchParams.get("rateCount");

  const [selectedRate, setSelectedRate] = useState<number>(
    rateParam ? Number(rateParam) : 0,
  );

  useEffect(() => {
    const param = searchParams.get("rateCount");
    setSelectedRate(param ? Number(param) : 0);
  }, [searchParams]);

  const handleSelect = (rate: number) => {
    const nextRate = selectedRate === rate ? 0 : rate;
    setSelectedRate(nextRate);

    const newUrl = updateSearchParams(
      searchParams,
      { rateCount: nextRate > 0 ? nextRate.toString() : null },
      { resetPage: true },
    );

    router.push(`${pathname}${newUrl}`, { scroll: false });
  };

  const handleReset = () => {
    setSelectedRate(0);

    const newUrl = updateSearchParams(
      searchParams,
      { rateCount: null },
      { resetPage: true },
    );

    router.push(`${pathname}${newUrl}`, { scroll: false });
  };

  useImperativeHandle(ref, () => ({
    resetLocal: () => {
      setSelectedRate(0);
    },
  }));

  return (
    <div>
      <header className="flex justify-between items-end mb-3">
        <h2 className="text-zinc-900 dark:text-zinc-50 text-xl font-medium">{t("title")}</h2>

        {selectedRate > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-red-600 text-md cursor-pointer"
          >
            <X size={16} />
            {t("reset")}
          </button>
        )}
      </header>

      <div className="flex gap-2">
        {Array.from({ length: MAX_RATING }).map((_, index) => {
          const starIndex = index + 1;
          const isFilled = starIndex <= selectedRate;

          return (
            <Star
              key={starIndex}
              size={28}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(starIndex);
              }}
              className={`cursor-pointer transition-colors ${
                isFilled ? "fill-amber-500 text-amber-500" : "text-amber-500"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
});

RatingFilter.displayName = "RatingFilter";
export default RatingFilter;
