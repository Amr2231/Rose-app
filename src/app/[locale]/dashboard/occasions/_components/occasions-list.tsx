"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOccasions } from "@/hooks/use-occasions";
import { cn } from "@/lib/utils/tailwind-merge";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDeleteOccasions } from "../_hooks/use-delete-occasions";
import { useRouter } from "@/i18n/navigation";
import PaginationWrapper from "@/components/ui/pagination-wrapper";
import { useTranslations } from "next-intl";
import OccasionsListSkeleton from "./occasions-list-skeleton";
import { Spinner } from "@/components/ui/spinner";

interface OccasionsListProps {
  search?: string;
}

export default function OccasionsList({ search = "" }: OccasionsListProps) {
  //Translations
  const t = useTranslations();

  // State
  const [selected, setSelected] = useState<string | null>(null);
  const [deleteedId, setDeletedId] = useState<string | null>(null);

  const urlSearchParams = useSearchParams();
  const pageFromUrl = urlSearchParams?.get("page") ?? undefined;

  const queryParams: Record<string, string> = {};
  if (search.trim()) queryParams.search = search.trim();
  if (pageFromUrl) queryParams.page = pageFromUrl;

  // Mutations and Queries
  const { data, isLoading, error } = useOccasions(queryParams);
  const { mutate, isPending } = useDeleteOccasions();

  const router = useRouter();

  if (isLoading) return <OccasionsListSkeleton />;
  if (error) return <div>{t("failed-to-load-occasions")}</div>;

  return (
    <>
      {/* Mobile: card list */}
      <div className="lg:hidden divide-y divide-zinc-100">
        <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 pb-2">
          <span>{t("name")}</span>
          <span>{t("products")}</span>
        </div>
        {data?.occasions.map((occ) => (
          <div
            key={occ._id}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="capitalize font-medium text-zinc-800 dark:text-zinc-100 truncate">
                {occ.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {occ.productsCount} {t("products")}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="shrink-0">
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/dashboard/occasions/update-occasion/${occ._id}`
                    )
                  }
                >
                  <Edit size={15} className="mr-2" />{" "}
                  {t("dashboard.categories.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeletedId(occ._id);
                    mutate(occ._id);
                  }}
                  className="text-red-600"
                >
                  {isPending && deleteedId == occ._id ? (
                    <Spinner />
                  ) : (
                    <>
                      <Trash2 size={15} className="mr-2" /> {t("delete")}
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <Table className="hidden lg:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">{t("name")}</TableHead>
            <TableHead className="text-center">{t("products")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.occasions.map((occ) => (
            <TableRow
              key={occ._id}
              onClick={() => setSelected(occ._id)}
              className={cn(
                "cursor-pointer",
                selected === occ._id && "bg-maroon-50 hover:bg-maroon-100"
              )}
            >
              <TableCell>{occ.name}</TableCell>
              <TableCell className="text-center">{occ.productsCount}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end me-5">
                <span
                  className="flex items-center text-sm cursor-pointer px-2 py-1 rounded hover:scale-105 transition-all bg-[#0063D01A] text-blue-600"
                  onClick={() =>
                    router.push(
                      `/dashboard/occasions/update-occasion/${occ._id}`
                    )
                  }
                >
                  <Edit size={14} /> {t("dashboard.categories.edit")}{" "}
                </span>
                <span
                  className="flex items-center text-sm cursor-pointer px-2 py-1 rounded hover:scale-105 transition-all bg-[#FF00001A] text-red-600"
                  onClick={() => {
                    setDeletedId(occ._id);
                    mutate(occ._id);
                  }}
                >
                  {isPending && deleteedId == occ._id ? (
                    <Spinner />
                  ) : (
                    <>
                      <Trash2 size={14} />
                      {t("delete")}
                    </>
                  )}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationWrapper
        totalPages={data?.metadata?.totalPages as number}
        searchParams={queryParams}
      />
    </>
  );
}
