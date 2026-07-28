import React from "react";
import { getTranslations } from "next-intl/server";
import ChangePasswordForm from "@/app/[locale]/(website)/profile/change-password/_components/change-password-form";
import SetBreadcrumb from "../../_components/bread-crumb/set-breadcrumb";

export default async function Page() {
  const t = await getTranslations();

  return (
    <div>
      <SetBreadcrumb label={t("change-password")} />
      <ChangePasswordForm />
    </div>
  );
}
