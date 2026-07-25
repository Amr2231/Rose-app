import { getCategory } from "@/lib/services/single-category.service";
import UpdateCategoryForm from "../_components/update-category-form";
import SetBreadcrumb from "../../../_components/bread-crumb/set-breadcrumb";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategory(id);
  const t = await getTranslations("dashboard.categories");

  return (
    <>
      <SetBreadcrumb label={`${t("updateCategory")} : ${category?.name}`} />
      <UpdateCategoryForm
        id={category?._id}
        defaultName={category?.name || ""}
      />
    </>
  );
}
