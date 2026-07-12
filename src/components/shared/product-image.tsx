"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export function ProductImage() {
  // hooks
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState<number>(0);

  // static images
  const images: string[] = ["/assets/1.png", "/assets/2.png", "/assets/3.png"];

  const displayedImages = images.slice(0, count);
  const isMultiple = displayedImages.length > 1;

  // effects
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex gap-4">
      {/* button for display 1 image for test */}
      <Button
        onClick={() => {
          setCount(1);
          setOpen(true);
          setCurrent(0);
        }}
      >
        Show 1 Image
      </Button>

      {/* button for display Multiple images for test */}
      <Button
        onClick={() => {
          setCount(3);
          setOpen(true);
          setCurrent(0);
        }}
      >
        Show 3 Images
      </Button>

      {/* dialog and carousel */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <Carousel setApi={setApi} className="w-full relative">
            <CarouselContent>
              {displayedImages.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[400px] mt-10 mb-11">
                    <Image
                      src={src}
                      alt="preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Bottom Controls */}
            {isMultiple && (
              <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between   px-4">
                {/* Bullets — left side */}
                <div className="flex gap-2 ">
                  {displayedImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        current === index ? "bg-maroon-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrows — right side */}
                <div className="flex gap-2">
                  <CarouselPrevious className="relative inset-0 translate-y-0 text-maroon-200" />
                  <CarouselNext className="relative inset-0 translate-y-0 text-maroon-200" />
                </div>
              </div>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
