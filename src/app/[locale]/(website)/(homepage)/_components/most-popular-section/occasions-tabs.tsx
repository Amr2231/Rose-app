"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MostPopularTabsProps, Occasion } from "@/lib/types/occasion";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function OccasionsTabs({
  occasions,
  activeOccasion,
}: MostPopularTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("occasion", id);

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <Carousel
      opts={{ align: "start", dragFree: true }}
      className="w-full sm:max-w-[420px] lg:max-w-[520px]"
    >
      <CarouselContent className="-ml-4">
        {occasions.map((occasion: Occasion) => {
          const isActive = activeOccasion === occasion._id;
          return (
            <CarouselItem
              key={occasion._id}
              className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4"
            >
              <button
                type="button"
                onClick={() => handleClick(occasion._id)}
                className={cn(
                  "relative w-full truncate pb-1 text-start text-sm font-medium capitalize transition-colors",
                  isActive
                    ? "text-maroon-700 dark:text-softPink-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-6 after:bg-maroon-600 after:content-['']"
                    : "text-zinc-500 hover:text-maroon-600 dark:text-zinc-400 dark:hover:text-softPink-300"
                )}
              >
                {occasion.name}
              </button>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious className="hidden h-7 w-7 -left-3 top-1/2 -translate-y-1/2 bg-maroon-600 text-white hover:bg-maroon-700 hover:text-white sm:flex" />
      <CarouselNext className="hidden h-7 w-7 -right-3 top-1/2 -translate-y-1/2 bg-maroon-600 text-white hover:bg-maroon-700 hover:text-white sm:flex" />
    </Carousel>
  );
}
