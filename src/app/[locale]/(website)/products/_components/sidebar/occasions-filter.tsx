"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { useOccasions } from "@/hooks/use-occasions";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { updateSearchParams } from "@/lib/utils/url";
import SafeImage from "@/components/shared/safe-image";

// The new backend returns `image`/`cover` as a full absolute URL already
// (confirmed via the product `cover` field), so it must NOT be prefixed
// with the API base URL - doing so was producing doubled-up URLs like
// "https://.../https://.../storage/..." that 404 on next/image.

const ProductFilters = forwardRef((_, ref) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("occasion-filter");

  const { data: occasionsData, isLoading, isError } = useOccasions();

  const [selectedOccasion, setSelectedOccasion] = useState(
    searchParams.get("occasion") || null,
  );

  useEffect(() => {
    setSelectedOccasion(searchParams.get("occasion"));
  }, [searchParams]);

  const updateUrl = (occasionId: string | null) => {
    const newUrl = updateSearchParams(
      searchParams,
      { occasion: occasionId },
      { resetPage: true },
    );
    router.push(`${pathname}${newUrl}`, { scroll: false });
  };

  const handleSelect = (id: string) => {
    if (selectedOccasion === id) {
      setSelectedOccasion(null);
      updateUrl(null);
    } else {
      setSelectedOccasion(id);
      updateUrl(id);
    }
  };

  const resetOccasions = () => {
    setSelectedOccasion(null);
    updateUrl(null);
  };

  useImperativeHandle(ref, () => ({
    resetLocal: () => setSelectedOccasion(null),
  }));

  if (isError) {
    return <div className="p-4 text-red-500">{t("error")}</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg text-zinc-900 dark:text-zinc-50">{t("title")}</h3>
        {selectedOccasion && (
          <button
            onClick={resetOccasions}
            className="flex items-center gap-1 text-red-600 text-md cursor-pointer"
          >
            <X size={20} />
            {t("reset")}
          </button>
        )}
      </div>

      <div className="w-full bg-white dark:bg-zinc-900 max-h-80 overflow-auto hide-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-100 dark:bg-zinc-700 h-20 rounded-xl animate-pulse"
                  />
                ))
            : occasionsData?.occasions.map((occasion) => {
                const isActive = selectedOccasion === occasion._id;
                return (
                  <div
                    key={occasion._id}
                    onClick={() => handleSelect(occasion._id)}
                    className={cn(
                      "group relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent transition-all active:scale-95",
                      isActive && "border-maroon-600",
                    )}
                  >
                    <SafeImage
                      src={occasion.image}
                      alt={occasion.name}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center p-2 text-center transition-all duration-300",
                        !isActive && "bg-black/40 group-hover:bg-black/20",
                        isActive &&
                          "bg-gradient-to-t from-maroon-800/90 to-maroon-800/0",
                      )}
                    >
                      <span className="text-zinc-50">{occasion.name}</span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
});

ProductFilters.displayName = "ProductFilters";
export default ProductFilters;
