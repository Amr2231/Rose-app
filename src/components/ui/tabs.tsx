// "use client";

// import * as React from "react";
// import * as TabsPrimitive from "@radix-ui/react-tabs";

// import { cn } from "@/lib/utils/tailwind-merge";

// const Tabs = TabsPrimitive.Root;

// const TabsList = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.List>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.List
//     ref={ref}
//     className={cn(
//       "inline-flex h-9 items-center justify-center rounded-lg text-muted-foreground",
//       className
//     )}
//     {...props}
//   />
// ));
// TabsList.displayName = TabsPrimitive.List.displayName;

// const TabsTrigger = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Trigger>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.Trigger
//     ref={ref}
//     className={cn(
//       // default styles
//       "inline-flex w-full items-center justify-center whitespace-nowrap px-4 py-3 gap-2 text-base font-medium transition-all capitalize",
//       // active state
//       "data-[state=active]:rounded-lg data-[state=active]:rounded-r-none data-[state=active]:border-r-none data-[state=active]:border-t data-[state=active]:border-b data-[state=active]:border-maroon-600 data-[state=active]:bg-maroon-600 data-[state=active]:text-white hover:data-[state=active]:bg-maroon-700 focus:data-[state=active]:shadow-[0_0_0_4px_#741C2140]",
//       // inactive state
//       "data-[state=inactive]:rounded-lg data-[state=inactive]:rounded-l-none data-[state=inactive]:border-l-none data-[state=inactive]:border-zinc-300 data-[state=inactive]:bg-zinc-50 data-[state=inactive]:text-zinc-800 focus:data-[state=inactive]:shadow-[0_0_0_4px_#741C2140]",
//       // disabled state
//       "disabled:data-[state=active]:bg-zinc-300 disabled:data-[state=active]:text-zinc-800 disabled:data-[state=active]:rounded-tl-[0.625rem] disabled:data-[state=active]:rounded-bl-[0.625rem]",
//       className
//     )}
//     {...props}
//   />
// ));

// TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// const TabsContent = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.Content
//     ref={ref}
//     className={cn(
//       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
//       className
//     )}
//     {...props}
//   />
// ));
// TabsContent.displayName = TabsPrimitive.Content.displayName;

// export { Tabs, TabsList, TabsTrigger, TabsContent };

"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/tailwind-merge";
import { cva } from "class-variance-authority";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  // default styles
  "inline-flex w-full items-center justify-center whitespace-nowrap px-4 py-3 gap-2 text-base font-medium transition-all capitalize",
  {
    variants: {
      variant: {
        active:
          "data-[state=active]:rounded-lg data-[state=active]:rounded-r-none data-[state=active]:border-r-none data-[state=active]:border-t data-[state=active]:border-b data-[state=active]:border-maroon-600 data-[state=active]:bg-maroon-600 data-[state=active]:text-white hover:data-[state=active]:bg-maroon-700 focus:data-[state=active]:shadow-[0_0_0_4px_#741C2140]",
        inactive:
          "data-[state=inactive]:rounded-lg data-[state=inactive]:rounded-l-none data-[state=inactive]:border-l-none data-[state=inactive]:border-zinc-300 data-[state=inactive]:bg-zinc-50 data-[state=inactive]:text-zinc-800 focus:data-[state=inactive]:shadow-[0_0_0_4px_#741C2140]",
      },
      disabled: {
        true: "disabled:data-[state=active]:bg-zinc-300 disabled:data-[state=active]:text-zinc-800 disabled:data-[state=active]:rounded-tl-[0.625rem] disabled:data-[state=active]:rounded-bl-[0.625rem]",
      },
    },
    defaultVariants: {
      variant: "inactive",
    },
  }
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "active" | "inactive";
    disabled?: boolean;
  }
>(({ className, variant, disabled, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, disabled }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
