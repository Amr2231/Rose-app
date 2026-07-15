"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import TitleOfSection from "@/components/shared/title-of-section";
import SafeImage from "@/components/shared/safe-image";
import { Occasion } from "@/lib/types/occasion";

type OccasionsShowcaseCarouselProps = {
  occasions: Occasion[];
};

export default function OccasionsShowcaseCarousel({
  occasions,
}: OccasionsShowcaseCarouselProps) {
  const t = useTranslations("occasions-showcase");

  return (
    <section className="flex flex-col gap-6 mt-14">
      <TitleOfSection
        title={t("eyebrow")}
        subtitle={t("title")}
        className="items-start py-0 text-start"
        subtitleClassName="text-2xl sm:text-3xl lg:text-4xl text-start"
      />

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {occasions.map((occasion) => (
            <CarouselItem
              key={occasion._id}
              className="pl-4 basis-[78%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link
                href={`/products?occasion=${occasion._id}`}
                className="group block h-full"
              >
                <Card className="h-full overflow-hidden border-none shadow-md dark:bg-zinc-800 transition-transform duration-300 group-hover:-translate-y-1">
                  <CardContent className="flex h-full flex-col p-0">
                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden sm:h-48">
                      <SafeImage
                        src={occasion.image}
                        alt={occasion.name}
                        fill
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />

                      <span className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-maroon-700 opacity-0 shadow transition-all duration-300 group-hover:opacity-100 dark:bg-zinc-900/90 dark:text-softPink-300">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <p className="text-lg font-semibold capitalize text-maroon-700 dark:text-softPink-200">
                        {occasion.name}
                      </p>
                      {occasion.description && (
                        <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {occasion.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex bg-maroon-600 text-white hover:bg-maroon-700 hover:text-white -left-4 lg:-left-5 top-1/2 -translate-y-1/2" />
        <CarouselNext className="hidden sm:flex bg-maroon-600 text-white hover:bg-maroon-700 hover:text-white -right-4 lg:-right-5 top-1/2 -translate-y-1/2" />
      </Carousel>
    </section>
  );
}
