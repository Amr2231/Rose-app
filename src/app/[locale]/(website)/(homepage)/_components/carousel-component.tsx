"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// section dummy data
const carouselItems = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
];
const img = "/assets/banner.png";

//component
export default function CarouselComponent() {
  const t = useTranslations("home.carousel");

  // navigation
  const router = useRouter();

  //state
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // useEffect
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Render
  return (
    // TODO: colors to be changed

    <section className="w-full flex justify-center">
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 w-full">
        {/* side card  */}
        <div className="relative w-full h-64 sm:h-72 lg:h-auto lg:min-w-80 lg:w-80 flex-shrink-0 overflow-hidden rounded-xl bg-[#4A1010]">
          <Image
            src={img}
            alt="special gifts"
            className="object-cover opacity-80"
            fill
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end text-white p-4 sm:p-6 bg-gradient-to-r from-black/10 to-transparent">
            <span className="bg-white text-red-600 text-xs font-medium px-2 mb-3 rounded-full w-fit">
              {t("startingFrom")}
            </span>
            <h2 className="text-lg sm:text-2xl font-semibold mb-3 pb-2 sm:pb-4">
              {t("specialGiftsHeading")}
            </h2>
            <Button
              onClick={() => router.push("/products")}
              className="w-fit bg-pink-50 text-rose-900 px-4 sm:px-5 py-2 rounded-xl flex items-center hover:text-white"
            >
              {t("shopNow")} <ArrowRight />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className="flex-grow overflow-hidden rounded-2xl"
        >
          <CarouselContent className="h-72 sm:h-80 lg:h-100 ">
            {carouselItems.map((item, index) => (
              <CarouselItem key={index} className="relative h-full ">
                <Image
                  src={item}
                  alt="flower image"
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Dots */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex gap-2 z-20">
            {carouselItems.map((e, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  current === index ? "w-8 bg-rose-600" : "w-2 bg-white/50",
                )}
              />
            ))}
          </div>
          {/* Navigation */}
          {/* // TODO: colors to be changed */}

          {/* layer div  */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80  to-transparent z-10 pointer-events-none" />

          <div className="absolute bottom-6 left-4 sm:bottom-12 sm:left-12 z-20 flex flex-col items-start text-white max-w-[85%]">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-1">{t("sayItWithFlowers")}</h1>
            <p className="mb-4 sm:mb-8 text-sm sm:text-base">{t("elegantGifts")}</p>
            <Button
              onClick={() => router.push("/products")}
              className="w-fit bg-[#FDF0F0] text-rose-900 font-medium px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg rounded-2xl hover:text-white"
            >
              {t("imBuying")}
            </Button>
          </div>

          {/* carousel buttons */}
          <div className="absolute bottom-3 right-3 sm:bottom-8 sm:right-12 z-20 flex items-center gap-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            <CarouselPrevious className="static translate-y-0 border-none bg-transparent dark:text-zinc-50" />
            <CarouselNext className="static translate-y-0 border-none bg-transparent dark:text-zinc-50" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
