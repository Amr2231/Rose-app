"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { Category } from "@/lib/types/category";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useDeleteCategory } from "../../_hooks/use-delete-category";
import { useTranslations } from "next-intl";
import CategoriesTableSkeleton from "./categories-table-skeleton";

type Props = {
  categories: Category[];
  isLoading: boolean;
};

export default function CategoriesTable({ categories, isLoading }: Props) {
  // translations
  const t = useTranslations("dashboard.categories");

  // Navigation
  const router = useRouter();

  // Queries
  const { mutate: deleteCategory } = useDeleteCategory();

  if (isLoading) {
    return <CategoriesTableSkeleton />;
  }

  if (!categories.length) {
    return (
      <div className="py-10 text-center text-zinc-500 dark:text-zinc-400 text-lg">
        {t("noCategories")}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="lg:hidden divide-y divide-zinc-100">
        <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 pb-2">
          <span>{t("name")}</span>
          <span>{t("products")}</span>
        </div>
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="capitalize font-medium text-zinc-800 dark:text-zinc-100 truncate">
                {category.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {category.productsCount} {t("products")}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={t("edit")}
                  className="shrink-0"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/dashboard/categories/update-category/${category._id}`
                    )
                  }
                >
                  <Pencil size={15} className="mr-2" /> {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteCategory(category._id)}
                  className="text-red-600"
                >
                  <Trash2 size={15} className="mr-2" /> {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <table className="hidden lg:table w-full border-collapse table-fixed rtl:table-auto ltr:table-fixed">
        <thead className="bg-red-50">
          <tr className="border-b bg-zinc-50 dark:bg-zinc-950 rtl:text-right ltr:text-left">
            <th className="py-3 w-64 rtl:pr-5 ltr:pl-5">{t("name")}</th>
            <th className="rtl:text-right">{t("products")}</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category._id}
              className="border-b transition-colors my-2 hover:bg-maroon-50"
            >
              <td className="capitalize py-3 font-medium duration-300 rtl:pr-5 rtl:text-right ltr:pl-5">
                {category.name}
              </td>
              <td className="text-zinc-600 dark:text-zinc-300 rtl:text-right">
                {category.productsCount} {t("products")}
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="inactive"
                    className="text-blue-600 bg-blue-600/10 hover:bg-blue-600/15 transition-colors duration-300 font-medium focus:shadow-none"
                    onClick={() =>
                      router.push(
                        `/dashboard/categories/update-category/${category._id}`
                      )
                    }
                  >
                    <Pencil size={15} /> {t("edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="inactive"
                    className="text-red-600 bg-red-600/10 hover:bg-red-600/15 transition-colors duration-300 font-medium focus:shadow-none"
                    onClick={() => deleteCategory(category._id)}
                  >
                    <Trash2 size={15} /> {t("delete")}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
