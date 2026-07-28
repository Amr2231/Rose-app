"use client";
import { ReactNode } from "react";
import AccountForm from "@/app/[locale]/(website)/profile/_components/account-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ProfileSetting() {
  // navigation
  const router = useRouter();

  //   Translation
  const t = useTranslations("login");

  const extraActions: ReactNode = <Button>{t("change-password")}</Button>;

  // redirect to change password page
  const onChangePassword = () => {
    router.push("/dashboard/account-settings/change-password");
  };

  return (
    <>
      <div className="mx-auto my-6 lg:my-20">
        <AccountForm
          extraActions={extraActions}
          onChangePassword={onChangePassword}
        />
      </div>
    </>
  );
}
