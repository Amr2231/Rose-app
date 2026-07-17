"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { X } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/lib/types/category";
import { updateSearchParams } from "@/lib/utils/url";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";
import Image from "next/image";

const ITEMS_PER_LOAD = 5;

const CategoryFilter = forwardRef((props, ref) => {
  // Translation
  const t = useTranslations("category-filter");

  // Navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // States
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [selectedId, setSelectedId] = useState<string | null>(categoryParam);

  useEffect(() => {
    setSelectedId(searchParams.get("category"));
  }, [searchParams]);

  // Queries
  const { data } = useCategories();

  // Variables
  const categories = [...(data?.categories ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const visibleCategories = categories.slice(0, visibleCount);

  // Functions
  const handleSelect = (id: string) => {
    setSelectedId(id);
    const newUrl = updateSearchParams(
      searchParams,
      { category: id },
      { resetPage: true },
    );
    router.push(`${pathname}${newUrl}`, { scroll: false });
  };

  const handleReset = () => {
    setSelectedId(null);
    setVisibleCount(ITEMS_PER_LOAD);
    const newUrl = updateSearchParams(
      searchParams,
      { category: null },
      { resetPage: true },
    );
    router.push(`${pathname}${newUrl}`, { scroll: false });
  };

  // Expose resetLocal for Reset All
  useImperativeHandle(ref, () => ({
    resetLocal: () => {
      setSelectedId(null);
      setVisibleCount(ITEMS_PER_LOAD);
    },
  }));

  return (
    <div>
      <header className="flex justify-between items-end mb-3">
        <h2 className="text-zinc-900 dark:text-zinc-50 text-xl font-medium">{t("title")}</h2>
        {selectedId && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-red-600 text-md cursor-pointer"
          >
            <X size={16} />
            {t("reset")}
          </button>
        )}
      </header>

      <div
        id="category-scroll"
        className="h-68 overflow-y-auto pr-1 hide-scrollbar"
      >
        <InfiniteScroll
          dataLength={visibleCategories.length}
          next={() => setVisibleCount((prev) => prev + ITEMS_PER_LOAD)}
          hasMore={visibleCategories.length < categories.length}
          scrollableTarget="category-scroll"
          loader={
            <p className="text-center text-sm py-2 text-zinc-400 dark:text-zinc-500">
              {t("loading-more")}
            </p>
          }
        >
          <ul className="space-y-1">
            {visibleCategories.map((cat: Category) => {
              const isActive = selectedId === cat._id;
              return (
                <li
                  key={cat._id}
                  onClick={() => handleSelect(cat._id)}
                  className={cn(
                    "h-12 flex items-center gap-3 rounded-lg cursor-pointer transition",
                    isActive
                      ? "bg-maroon-50 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-50"
                      : "bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700",
                  )}
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-md
                      ${isActive ? "bg-maroon-600" : "bg-zinc-500"}
                    `}
                  >
                    <Image
                      width={24}
                      height={24}
                      src={cat.image}
                      alt={cat.name}
                      className="w-6 h-6 object-contain filter brightness-[10]"
                    />
                  </div>
                  <span className="font-medium capitalize">{cat.name}</span>
                </li>
              );
            })}
          </ul>
        </InfiniteScroll>
      </div>
    </div>
  );
});

CategoryFilter.displayName = "CategoryFilter";
export default CategoryFilter;
