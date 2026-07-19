"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

// Types
interface DeleteConfirmationProps {
  loading: boolean;
  isRTL: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  translations: {
    title: string;
    cancel: string;
    confirm: string;
  };
}

// Component
export function DeleteConfirmation({
  loading,
  isRTL,
  onCancel,
  onConfirm,
  translations: t,
}: DeleteConfirmationProps) {
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="p-8 text-center flex flex-col justify-end min-h-[23.4rem]"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="relative flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-200/50 absolute" />
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center relative z-10">
            <Trash2 className="text-gray-600" size={30} />
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-10">{t.title}</h2>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {/* Cancel */}
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 h-12 rounded-xl"
        >
          {t.cancel}
        </Button>

        {/* Confirm */}
        <Button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : t.confirm}
        </Button>
      </div>
    </div>
  );
}
