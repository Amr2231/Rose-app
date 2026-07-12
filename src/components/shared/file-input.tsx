"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

type FileInputProps = {
  name?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  error?: boolean;
};

export default function FileInput({
  name,
  value,
  onChange,
  disabled,
  error,
}: FileInputProps) {
  const t = useTranslations();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input
        ref={fileRef}
        type="file"
        name={name}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onChange?.(file);
        }}
      />

      <div
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-lg border px-3 text-sm transition-colors",
          error
            ? "border-red-600"
            : "border-zinc-300 hover:border-zinc-400 focus-within:border-maroon-600",
          disabled && "cursor-not-allowed bg-zinc-100"
        )}
      >
        <span className="truncate text-zinc-700">{value && value.name}</span>

        <Button
          variant="ghost"
          type="button"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 text-maroon-500"
        >
          <Upload size={16} />
          <span>{t("upload-file")}</span>
        </Button>
      </div>
    </>
  );
}
