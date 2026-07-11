"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

// Types
export interface PasswordInputProps extends React.ComponentPropsWithoutRef<
  typeof Input
> {
  label?: string;
  rtl?: boolean;
  error?: boolean;
}

// Password Component
export const PasswordInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  PasswordInputProps
>(({ rtl = false, disabled, error, className, ...props }, ref) => {
  // State
  const [show, setShow] = React.useState(false);

  // Render
  return (
    <div className="relative w-full ">
      {/* Input Field */}
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        disabled={disabled}
        placeholder="********"
        className={cn(
          "h-12 rounded-lg p-4 text-base leading-4 appearance-none", //Base
          rtl ? "pl-11 pr-4" : "pr-11 pl-4", // Padding (RTL / LTR)
          "bg-white border border-zinc-300 text-gray-900 placeholder:text-gray-400",
          "dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:placeholder:text-zinc-400", // Default / Active
          "hover:border-zinc-400 dark:hover:border-zinc-500", // Hovered
          "focus:outline-none focus:border-maroon-600 dark:focus:border-softPink-400", // Focused
          error &&
            "border-red-600 focus:border-red-600 dark:border-red-500 dark:focus:border-red-500", // Error
          disabled &&
            "bg-zinc-100 border-zinc-300 text-zinc-400 dark:bg-zinc-700 dark:border-zinc-700", // Disabled
          "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden", // Hide native reveal
          className
        )}
        {...props}
      />

      {/* Eye toggle */}
      <button
        type="button"
        disabled={disabled}
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((p) => !p)}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
          rtl ? "left-4" : "right-4",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {show ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
