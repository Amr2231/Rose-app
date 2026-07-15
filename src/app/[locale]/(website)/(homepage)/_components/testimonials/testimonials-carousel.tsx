"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TestimonialCard from "./testimonial-card";

type TestimonialsCarouselProps = {
  testimonials: TestimonialProps[];
};

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const locale = useLocale();

  const autoplay = React.useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: true }),
    [],
  );

  if (!testimonials.length) {
    return null;
  }

  return (
    <Carousel
      plugins={[autoplay]}
      onMouseEnter={autoplay.stop}
      onMouseLeave={autoplay.reset}
      opts={{
        align: "start",
        loop: testimonials.length > 1,
        direction: locale === "ar" ? "rtl" : "ltr",
        dragFree: false,
        skipSnaps: false,
        duration: 25,
      }}
      className="container mx-auto w-full"
    >
      <CarouselContent className="px-5 -ml-2 md:-ml-4">
        {testimonials.map((item) => (
          <CarouselItem
            key={item._id}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <div className="flex items-center justify-center h-full min-h-[433px]">
              <TestimonialCard
                _id={item._id}
                name={item.name}
                image={item.image}
                rating={item.rating}
                content={item.content}
                updatedAt={item.updatedAt}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="bg-maroon-600 text-white hover:bg-maroon-700 hover:text-white -left-2 md:-left-4 top-1/2" />
      <CarouselNext className="bg-maroon-600 text-white hover:bg-maroon-700 hover:text-white -right-2 md:-right-4 top-1/2" />
    </Carousel>
  );
}
