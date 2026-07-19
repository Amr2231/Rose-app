import { cn } from "@/lib/utils/tailwind-merge";
import Image from "next/image";
import React from "react";

export default function PayMethod({
  index,
  image,
  title,
  description,
  selectedMethod,
}: PayMethodProps) {
  return (
    <div
      className={cn(
        "flex-1 border border-zinc-300 rounded-lg flex flex-col items-center justify-center h-full py-4 sm:py-0 px-2",
        selectedMethod && "bg-zinc-50"
      )}
      key={index}
    >
      <Image
        src={image}
        alt="Credit Card"
        width={195}
        height={195}
        className="w-24 h-24 sm:w-40 sm:h-40 md:w-[195px] md:h-[195px]"
      />
      <p
        className={cn(
          "text-lg sm:text-xl md:text-2xl font-semibold text-zinc-800 text-center",
          selectedMethod && "text-maroon-600"
        )}
      >
        {title}
      </p>
      <p className={cn("text-xs sm:text-sm font-semibold text-zinc-500 text-center")}>
        {description}
      </p>
    </div>
  );
}
