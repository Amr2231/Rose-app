"use client";

import * as React from "react";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FileInputProps {
  value?: FileList;
  onChange?: (files: FileList | null) => void;
  label?: string;
  error?: boolean;
  accept?: string;
  className?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, error, onChange, value, accept }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const fileName = value?.[0]?.name;

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.files);
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium">
            {label} <span className="text-red-600">*</span>
          </label>
        )}

        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as any).current = node;
          }}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />

        <div
          onClick={handleClick}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-xl border px-4 cursor-pointer transition",
            "bg-white",
            error ? "border-red-600" : "border-zinc-300 hover:border-zinc-400",
            className
          )}
        >
          <span className="text-sm text-zinc-500 truncate">{fileName}</span>

          <span className="flex items-center gap-2 text-red-600 font-medium text-sm">
            <Upload size={16} />
            Upload file
          </span>
        </div>
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };

type FileInputButtonProps = {
  name?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  error?: boolean;
};

function FileInputButton({
  name,
  value,
  onChange,
  disabled,
  error,
}: FileInputButtonProps) {
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
          <span>Upload File</span>
        </Button>
      </div>
    </>
  );
}

export { FileInputButton };
export type { FileInputButtonProps };
