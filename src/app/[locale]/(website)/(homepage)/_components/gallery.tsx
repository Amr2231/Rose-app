"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/tailwind-merge";

const galleryImages = [
  {
    src: "/assets/gallery1.png",
    alt: "Gift Boxes",
    className: "col-span-1 row-span-1 h-56 lg:h-auto lg:col-span-4 lg:row-span-7",
  },
  {
    src: "/assets/gallery2.png",
    alt: "Flowers & Chocolate",
    className:
      "col-span-1 row-span-1 h-56 lg:h-auto lg:col-span-4 lg:row-span-5 lg:row-start-8",
  },
  {
    src: "/assets/gallery3.png",
    alt: "Red Gifts",
    className:
      "col-span-1 row-span-1 h-56 lg:h-auto lg:col-span-4 lg:row-span-5 lg:col-start-5",
  },
  {
    src: "/assets/gallery4.png",
    alt: "Ring Detail",
    className:
      "col-span-1 row-span-1 h-56 lg:h-auto lg:col-span-4 lg:row-span-7 lg:col-start-5 lg:row-start-6",
  },
  {
    src: "/assets/gallery5.png",
    alt: "Engagement Ring",
    className:
      "col-span-1 row-span-1 h-56 lg:h-auto lg:col-span-4 lg:row-span-5 lg:col-start-9",
  },
  {
    src: "/assets/3.png",
    alt: "Engagement Card",
    className:
      "col-span-1 row-span-1 h-56 lg:h-auto lg:col-span-4 lg:row-span-7 lg:col-start-9 lg:row-start-6",
  },
];

export default function Gallery() {
  const t = useTranslations("gallery");

  return (
    <section className="container mx-auto">
      <div className="flex flex-col items-center py-8">
        <h2 className="font-bold uppercase tracking-[0.25em] text-softPink-500 dark:text-maroon-400">
          {t("label")}
        </h2>

        {/* pseudo-elements via Tailwind after: / before: */}
        <div className="relative mt-2 text-center">
          <p className="text-4xl font-bold text-maroon-700 dark:text-softPink-200 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:-z-10 after:h-4 after:w-3/4 after:rounded-e-2xl after:bg-softPink-100 dark:after:bg-zinc-700">
            {t("title")}
          </p>
          <div className="mx-auto mt-2 h-0.5 w-1/3 bg-softPink-600" />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:h-[67rem] lg:grid-rows-12 gap-3">
        {galleryImages.map((image, index) => (
          <div key={index} className={cn("relative", image.className)}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
