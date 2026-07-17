"use client";

import { useRef } from "react";
import CategoryFilter from "./category-filter";
import RatingFilter from "./rating-filter";
import ResetAllButton from "./reset-all";
import { usePathname, useRouter } from "@/i18n/navigation";
import ProductFilters from "./occasions-filter";
import PriceFilter from "./price-filter";

export default function ProductsSidebar() {
  // Refs
  const categoryRef = useRef<{ resetLocal: () => void }>(null);
  const ratingRef = useRef<{ resetLocal: () => void }>(null);
  const occasionsRef = useRef<{ resetLocal: () => void }>(null);
  const priceRef = useRef<{ resetLocal: () => void }>(null);

  // Navigation
  const router = useRouter();
  const pathname = usePathname();

  // Functions
  const handleResetAll = () => {
    // Reset local states inside filters
    categoryRef.current?.resetLocal();
    ratingRef.current?.resetLocal();
    occasionsRef.current?.resetLocal();
    priceRef.current?.resetLocal();

    // Remove all search params from URL
    router.push(pathname);
  };

  return (
    <aside className="flex flex-col p-2 gap-4 pt-0">
      <CategoryFilter ref={categoryRef} />
      <ProductFilters ref={occasionsRef} />
      <RatingFilter ref={ratingRef} />
      <PriceFilter ref={priceRef} />
      <ResetAllButton onResetAll={handleResetAll} />
    </aside>
  );
}
