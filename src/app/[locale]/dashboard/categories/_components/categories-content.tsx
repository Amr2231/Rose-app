"use client";

import { useCategories } from "@/hooks/use-categories";
import CategoriesHeader from "./categories-header";
import CategoriesTable from "./categories-table";
import PaginationWrapper from "@/components/ui/pagination-wrapper";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function CategoriesPageContent() {
  // Navigation
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Constants
  const searchPage = Number(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  // Queries
  const { data, isLoading } = useCategories({
    page: searchPage,
    search,
    limit: 10,
  });

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newUrl);
  };

  return (
    <>
      <CategoriesHeader search={search} onSearchChange={handleSearchChange} />

      <CategoriesTable
        categories={data?.categories || []}
        isLoading={isLoading}
      />

      {data?.metadata && (
        <PaginationWrapper
          totalPages={data.metadata.totalPages}
          className="mt-10 flex justify-center"
        />
      )}
    </>
  );
}
