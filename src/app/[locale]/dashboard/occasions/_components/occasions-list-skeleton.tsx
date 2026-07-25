"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

export default function OccasionsListSkeleton() {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">{t("name")}</TableHead>
          <TableHead className="text-center">{t("products")}</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            </TableCell>

            <TableCell className="text-center">
              <div className="h-4 w-10 mx-auto animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            </TableCell>

            <TableCell className="flex justify-end gap-2">
              <div className="h-7 w-14 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-7 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
