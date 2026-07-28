import React from "react";
import CreateProductForm from "../_components/create-product-form";
import { useTranslations } from "next-intl";

export default function Page() {
  // translations
  const t = useTranslations("create-product");
  return (
    <div>
      <h3 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
       {t('add-new-product')}
      </h3>
      <CreateProductForm />
    </div>
  );
}
