import React from "react";
import AddOccasionForm from "./_components/add-occasion-form";
import { getTranslations } from "next-intl/server";

export default async function page() {
  const t = await getTranslations();

  return (
    <div className="w-full lg:max-w-[69rem] ">
      <h1 className="text-2xl font-semibold mb-4">{t("add-new-occasion")}</h1>
      <AddOccasionForm />
    </div>
  );
}
