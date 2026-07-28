import React from "react";
import UpdateOccasionForm from "./_components/update-occasion-form";
import { getOccasionById } from "@/lib/actions/dashboard-occasions.actions";
import SetBreadcrumb from "../../../_components/bread-crumb/set-breadcrumb";
import { getTranslations } from "next-intl/server";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { occasion } = await getOccasionById(id);
  const t = await getTranslations();

  return (
    <div className="w-full lg:max-w-[69rem] ">
      <SetBreadcrumb label={`${t("update-occasion")} : ${occasion?.name}`} />
      <UpdateOccasionForm occasion={occasion} />
    </div>
  );
}
