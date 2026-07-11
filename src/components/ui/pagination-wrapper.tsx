"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

interface PaginationProps {
  totalPages: number;
  searchParams?: {
    page?: string;
  };
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export default function PaginationWrapper({
  totalPages,
  searchParams,
  currentPage: currentPageProp,
  onPageChange,
  className,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const locale = useLocale();

  const rtl = locale === "ar";

  const pageParam =
    currentPageProp ??
    Number(searchParams?.page ?? currentSearchParams.get("page") ?? "1");

  const currentPage = Math.max(1, Math.min(pageParam, totalPages));

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  function generatePageNumbers(): (number | "ellipsis")[] {
    const maxVisible = 5;
    const edgeThreshold = 3;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= edgeThreshold) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }

  const visiblePages = generatePageNumbers();

  function navigateToPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;

    if (onPageChange) {
      onPageChange(page);
      return;
    }

    const params = new URLSearchParams(currentSearchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return (
    <PaginationRoot className={className}>
      <PaginationContent dir={rtl ? "rtl" : "ltr"}>
        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(1)}
            aria-disabled={isFirstPage}
            className={cn(
              "cursor-pointer rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700",
              isFirstPage && "pointer-events-none opacity-50",
            )}
          >
            {rtl ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(currentPage - 1)}
            aria-disabled={isFirstPage}
            className={cn(
              "cursor-pointer rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700",
              isFirstPage && "pointer-events-none opacity-50",
            )}
          >
            {rtl ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </PaginationLink>
        </PaginationItem>

        {visiblePages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => navigateToPage(page)}
                className={cn(
                  "h-9 w-9 cursor-pointer rounded-lg border",
                  page === currentPage
                    ? "border-maroon-600 bg-maroon-600 text-white hover:border-maroon-700 hover:bg-maroon-700 dark:border-softPink-300 dark:bg-softPink-300 dark:text-black"
                    : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700",
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(currentPage + 1)}
            aria-disabled={isLastPage}
            className={cn(
              "cursor-pointer rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700",
              isLastPage && "pointer-events-none opacity-50",
            )}
          >
            {rtl ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(totalPages)}
            aria-disabled={isLastPage}
            className={cn(
              "cursor-pointer rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700",
              isLastPage && "pointer-events-none opacity-50",
            )}
          >
            {rtl ? (
              <ChevronsLeft className="h-4 w-4" />
            ) : (
              <ChevronsRight className="h-4 w-4" />
            )}
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
