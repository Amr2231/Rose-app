import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/tailwind-merge";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent dark:bg-softPink-300 dark:text-zinc-800 dark:hover:bg-softPink-400 bg-maroon-600 text-white shadow hover:bg-maroon-700",

        secondary:
          "border-transparent dark:bg-zinc-700 dark:text-softPink-300 dark:hover:bg-zinc-600 bg-maroon-50 text-maroon-600 hover:bg-maroon-100",

        subtle:
          "border-transparent dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600 bg-zinc-50 text-zinc-700 hover:bg-zinc-200",

        new: "bg-zinc-100 text-zinc-700 dark:bg-white-700 dark:text-zinc-100",

        hot: "bg-maroon-50 text-maroon-600",

        outOfStock: "bg-red-600 text-softPink-50",
      },
    },
    defaultVariants: {
      variant: "new",
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
