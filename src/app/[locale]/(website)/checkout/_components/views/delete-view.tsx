"use client";

import { useTranslations, useLocale } from "next-intl";
import { DeleteConfirmation } from "../delete-confirm";

// Types
interface DeleteViewProps {
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// Component
export function DeleteView({ loading, onCancel, onConfirm }: DeleteViewProps) {
  const tDelete = useTranslations("DeleteAddress");

  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <DeleteConfirmation
      loading={loading}
      isRTL={isRTL}
      onCancel={onCancel}
      onConfirm={onConfirm}
      translations={{
        title: tDelete("title"),
        cancel: tDelete("cancel"),
        confirm: tDelete("confirm"),
      }}
    />
  );
}
