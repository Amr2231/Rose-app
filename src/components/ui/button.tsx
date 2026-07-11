import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/tailwind-merge";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "dark:bg-softPink-300 dark:text-zinc-800 dark:hover:bg-softPink-400 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-600  bg-maroon-600 text-white shadow hover:bg-maroon-700 disabled:bg-zinc-300 disabled:text-zinc-500",
        secondary:
          "dark:bg-zinc-700 dark:text-softPink-300 dark:hover:bg-zinc-600 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-600 bg-maroon-50 text-maroon-600 shadow-sm hover:bg-maroon-100 disabled:bg-zinc-300 disabled:text-zinc-500",
        destructive:
          "dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-600 bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:bg-zinc-300 disabled:text-zinc-500",
        outline:
          "border dark:border-softPink-300 dark:bg-zinc-800 dark:text-softPink-300 dark:hover:bg-zinc-700 dark:disabled:border-zinc-600 dark:disabled:text-zinc-600 dark:disabled:bg-zinc-800  border-maroon-600 bg-white text-maroon-600 shadow-sm hover:border-maroon-300 hover:bg-maroon-50 disabled:border-zinc-300 disabled:text-zinc-400 disabled:bg-zinc-100",
        ghost:
          "dark:text-zinc-50 dark:hover:bg-zinc-700 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-600 text-zinc-800  disabled:bg-zinc-100 disabled:text-zinc-400",
        link: "dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 dark:disabled:border-zinc-600 dark:disabled:text-zinc-600 dark:disabled:bg-zinc-800 text-zinc-800 bg-zinc-50 border border-zinc-400 hover:bg-zinc-100 disabled:bg-zinc-300 disabled:text-zinc-400 disabled:border-zinc-300",
        light:
          "py-2 px-4 rounded-[0.625rem] bg-maroon-50 text-maroon-600 shadow-sm hover:bg-maroon-100 disabled:bg-zinc-300 disabled:text-zinc-500",

        inactive:
          "rounded-lg rounded-l-none border-l-none border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-50 focus:shadow-[0_0_0_4px_#741C2140]",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            {props.children} <Spinner />
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
