import React from "react";
import { cn } from "@/lib/utils/tailwind-merge";

type TitleOfSectionProps = {
  title?: string;
  subtitle: string;
  className?: string; // للـ container
  titleClassName?: string; // للـ title
  subtitleClassName?: string; // للـ subtitle
};

export default function TitleOfSection({
  title,
  subtitle,
  className,
  subtitleClassName,
}: TitleOfSectionProps) {
  return (
    <div className={cn("flex flex-col items-center py-8", className)}>
      {title && (
        <h2
          className={cn(
            "font-bold text-softPink-500 dark:text-maroon-400 uppercase"
          )}
        >
          {title}
        </h2>
      )}
      <div className="relative">
        <p
          className={cn(
            "font-bold text-2xl sm:text-3xl lg:text-4xl text-maroon-700 dark:text-softPink-200 text-center px-4",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
        <div className="h-[2px] w-[28%] bg-softPink-600 dark:bg-softPink-600"></div>
        <div className="absolute bottom-0 left-0 w-[72%] h-4 bg-softPink-100 dark:bg-zinc-700 -z-10 rounded-r-2xl"></div>
      </div>
    </div>
  );
}
