import { cn } from "@/lib/utils/tailwind-merge";
import React from "react";

export default function StepsShow({ step }: { step: string }) {
  return (
    <div className="flex items-center mb-8">
      <div className={cn("h-2 w-3/12 rounded-l-md bg-maroon-600")}></div>
      <div
        className={cn(
          "step1 w-6 h-6 rounded-full flex justify-center items-center bg-maroon-600 text-white"
        )}
      >
        1
      </div>

      <div
        className={cn("h-2 w-5/12 bg-zinc-200", step === "payment_method" && "bg-maroon-600")}
      ></div>
      <div
        className={cn(
          "step2 w-6 h-6 rounded-full flex justify-center items-center bg-zinc-200  text-zinc-500",
          step === "payment_method" && "bg-maroon-600 text-white"
        )}
      >
        2
      </div>
      <div
        className={cn(
          "h-2 w-3/12 rounded-r-md bg-zinc-200",
          step === "payment_method" && "bg-maroon-600"
        )}
      ></div>
    </div>
  );
}
