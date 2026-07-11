"use client";
import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind-merge";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";

export interface InputImageProps extends React.ComponentProps<"input"> {
  error?: boolean;
  id: string;
}

export const InputImage = forwardRef<HTMLInputElement, InputImageProps>(
  ({ className, error, id, ...props }, ref) => {
    const t = useTranslations("");
    return (
      <div
        className={cn(
          "flex h-12 w-full rounded-lg border bg-transparent text-base shadow-sm transition-colors outline-none relative",
          "text-zinc-800 placeholder:text-zinc-400",
          "hover:border-zinc-400 focus:border-maroon-600",
          "dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-700 dark:focus:border-softPink-300",
          "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:border-none",
          error &&
            "border-red-600 hover:border-red-600 focus:border-red-600 dark:border-red-500",
          className
        )}
      >
        <Input
          type="file"
          error={error}
          className={cn(className, "pr-12 hidden")}
          {...props}
          ref={ref}
          accept="image/*"
          id={id}
        />
        <label
          className="text-sm text-maroon-500 flex gap-1 absolute top-1/2 -translate-y-1/2 end-4"
          htmlFor={id}
        >
          <Upload size={18} />
          {t("upload-file")}
        </label>
      </div>
    );
  }
);

InputImage.displayName = "InputImage";
