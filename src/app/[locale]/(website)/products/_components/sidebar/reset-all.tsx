"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type ResetAllButtonProps = {
  onResetAll: () => void;
};

export default function ResetAllButton({ onResetAll }: ResetAllButtonProps) {
  // translation
  const t = useTranslations();

  // Navigation
  const searchParams = useSearchParams();

  // Disable button when no filters are applied
  const isDisabled = searchParams.toString().length === 0;

  return (
    <div
      onClick={onResetAll}
      className={`flex justify-center my-2 p-3 rounded-md transition-colors duration-300
        ${
          isDisabled
            ? "bg-zinc-200 dark:bg-zinc-700 cursor-not-allowed"
            : "bg-maroon-50 hover:bg-maroon-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
        }
      `}
    >
      <button
        disabled={isDisabled}
        className={`flex gap-3 justify-center items-center font-medium text-lg
          ${isDisabled ? "text-zinc-400 dark:text-zinc-500" : "text-maroon-600 dark:text-softPink-300"}
        `}
      >
        <RotateCcw size={20} />
        {t("reset-all")}
      </button>
    </div>
  );
}
