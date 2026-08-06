"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Edit, Trash2, MoreVertical } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeleteConfirmation } from "@/components/ui/delete-confirm";
import PaginationWrapper from "@/components/ui/pagination-wrapper";
import { useGetProducts } from "../../_hooks/use-get-products";
import { useDeleteProduct } from "../../_hooks/use-delete-product";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormatter, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// constants
const SKELETON_ROWS = 8;

// Skeleton row
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <TableRow key={i} style={{ height: "60px" }}>
          {/* Name */}
          <TableCell className="pl-5">
            <div className="h-4 w-40 rounded bg-gray-200 dark:bg-zinc-700 animate-pulse" />
          </TableCell>
          {/* Price */}
          <TableCell>
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-zinc-700 animate-pulse" />
          </TableCell>
          {/* Stock */}
          <TableCell>
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-zinc-700 animate-pulse" />
          </TableCell>
          {/* Sales */}
          <TableCell>
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-zinc-700 animate-pulse" />
          </TableCell>
          {/* Ratings */}
          <TableCell>
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-zinc-700 animate-pulse" />
          </TableCell>
          {/* Actions */}
          <TableCell className="pr-5">
            <div className="flex gap-3 justify-end">
              <div className="h-7 w-14 rounded-md bg-blue-100 animate-pulse" />
              <div className="h-7 w-14 rounded-md bg-red-100 animate-pulse" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

// Component
export default function ProductsTable() {
  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const format = useFormatter();
  const t = useTranslations("dashboard.products");

  // Derived
  const tableHeaders = [
    t("table.name"),
    t("table.price"),
    t("table.stock"),
    t("table.sales"),
    t("table.ratings"),
  ];

  // Derived from URL
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search") ?? "";

  // Local state only for the controlled input
  const [searchInput, setSearchInput] = useState(search);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Queries
  const { data, isLoading, isError } = useGetProducts(page, 12, search);
  const { mutate: deleteProduct, isPending: isDeleting } =
    useDeleteProduct(page);

  // Derived
  const products = data?.products ?? [];
  const metadata = data?.metadata;

  // Handlers
  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      // Reset to page 1 on new search
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // Debounce: search automatically 400ms after the user stops typing,
  // instead of requiring Enter/blur.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchInput === search) return;
    debounceRef.current = setTimeout(() => {
      handleSearch(searchInput);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Confirm delete
  function handleConfirmDelete() {
    if (!pendingDeleteId) return;
    deleteProduct(pendingDeleteId, {
      onSuccess: () => setPendingDeleteId(null),
    });
  }

  // Render
  return (
    <div className="flex flex-col gap-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-zinc-800 dark:text-zinc-100 font-semibold text-2xl">
          {t("title")}
        </h1>

        <Button
          variant="default"
          onClick={() => router.push(`${pathname}/create-product`)}
          className="p-2.5"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">{t("add-product")}</span>
        </Button>
      </div>

      {/* Search input*/}
      <div className="relative w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500"
          size={18}
        />
        <Input
          placeholder={t("search-placeholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(searchInput);
          }}
          onBlur={() => handleSearch(searchInput)}
          className="pl-11 pr-4"
        />
      </div>

      {/* States shared by both layouts */}
      {isLoading && (
        <div className="hidden lg:block rounded-2.5 bg-white dark:bg-zinc-900 overflow-hidden border border-gray-100 dark:border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableHead
                    key={index}
                    className={cn(
                      `${index === 0 ? "pl-5" : ""} text-black dark:text-zinc-50`,
                    )}
                  >
                    {header}
                  </TableHead>
                ))}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton />
            </TableBody>
          </Table>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-20 text-red-500 text-sm">
          {t("states.loading-error")}
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400 dark:text-zinc-500 text-sm">
          {t("states.empty")}
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
          {/* Mobile: card list */}
          <div className="lg:hidden divide-y divide-zinc-100">
            <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 pb-2">
              <span>{t("table.name")}</span>
              <span className="flex gap-8">
                <span>{t("table.price")}</span>
                <span>{t("table.stock")}</span>
              </span>
            </div>
            {products.map((product) => {
              const isOutOfStock = product.quantity <= 0;
              const isLowStock = product.quantity > 0 && product.quantity < 10;

              return (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <p className="min-w-0 flex-1 font-medium text-zinc-800 dark:text-zinc-100 truncate">
                    {product.title.length > 28
                      ? product.title.slice(0, 28) + "..."
                      : product.title}
                  </p>
                  <span className="text-sm text-zinc-600 dark:text-zinc-300 shrink-0">
                    {format.number(product.price, "currency-full")}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium shrink-0 w-8 text-center",
                      isOutOfStock
                        ? "text-red-600"
                        : isLowStock
                          ? "text-orange-500"
                          : "text-zinc-600 dark:text-zinc-300",
                    )}
                  >
                    {product.quantity.toLocaleString()}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="shrink-0">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`${pathname}/${product._id}/edit`)
                        }
                      >
                        <Edit size={15} className="mr-2" /> {t("actions.edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPendingDeleteId(product._id)}
                        className="text-red-600"
                      >
                        <Trash2 size={15} className="mr-2" />{" "}
                        {t("actions.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden lg:block rounded-2.5 bg-white dark:bg-zinc-900 overflow-hidden border border-gray-100 dark:border-zinc-800">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead
                      key={index}
                      className={cn(
                        `${index === 0 ? "pl-5" : ""} text-black dark:text-zinc-50`,
                      )}
                    >
                      {header}
                    </TableHead>
                  ))}
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product) => {
                  const isOutOfStock = product.quantity <= 0;
                  const isLowStock =
                    product.quantity > 0 && product.quantity < 10;

                  return (
                    <TableRow
                      key={product._id}
                      className="hover:bg-maroon-50 transition-colors border-t"
                      style={{ height: "60px" }}
                    >
                      <TableCell className="pl-5 font-medium text-gray-800 dark:text-zinc-100">
                        {product.title.length > 28
                          ? product.title.slice(0, 28) + "..."
                          : product.title}
                      </TableCell>

                      {/* Currency formatted with next-intl */}
                      <TableCell className="text-gray-600 dark:text-zinc-300">
                        {format.number(product.price, "currency-full")}
                      </TableCell>

                      {/* stock */}
                      <TableCell
                        className={cn(
                          "font-medium",
                          isOutOfStock
                            ? "text-red-600"
                            : isLowStock
                              ? "text-orange-500"
                              : "text-gray-600 dark:text-zinc-300",
                        )}
                      >
                        {product.quantity.toLocaleString()}
                      </TableCell>

                      {/* sold */}
                      <TableCell className="text-gray-600 dark:text-zinc-300">
                        {(product.sold ?? 0).toLocaleString()}
                      </TableCell>

                      {/* rating */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-zinc-300">
                          <span className="font-semibold">
                            {(product.rateAvg ?? 0).toFixed(1)}/5
                            <span className="text-gray-400 dark:text-zinc-500">
                              {" "}
                              ({product.rateCount ?? 0})
                            </span>
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions to edit */}
                      <TableCell className="pr-5">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() =>
                              router.push(`${pathname}/${product._id}/edit`)
                            }
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 px-2 py-1.5 rounded-md bg-blue-100 transition-colors"
                          >
                            <Edit size={13} />
                            {t("actions.edit")}
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setPendingDeleteId(product._id)}
                            className="flex items-center gap-1 text-xs font-medium text-red-500 px-2 py-1.5 rounded-md bg-red-100 transition-colors"
                          >
                            <Trash2 size={13} />
                            {t("actions.delete")}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Pagination */}
      {metadata && metadata.totalPages > 1 && (
        <PaginationWrapper
          totalPages={metadata.totalPages}
          searchParams={{ page: searchParams.get("page") ?? undefined }}
          className="mt-2"
        />
      )}

      {/* Delete Modal */}
      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl">
          <DeleteConfirmation
            loading={isDeleting}
            isRTL={false}
            onCancel={() => setPendingDeleteId(null)}
            onConfirm={handleConfirmDelete}
            translations={{
              title: t("delete-modal.title"),
              cancel: t("delete-modal.cancel"),
              confirm: t("delete-modal.confirm"),
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
