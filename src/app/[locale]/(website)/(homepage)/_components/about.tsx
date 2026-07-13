"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/tailwind-merge";

export default function About() {
  const t = useTranslations("about");

  const features = [
    t("features.f1"),
    t("features.f2"),
    t("features.f3"),
    t("features.f4"),
  ];

  const images = {
    main: "/assets/mainAbout.png",
    small: ["/assets/About2.png", "/assets/About3.png"],
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
      {/* Images Section */}
      <div className="flex items-start gap-4 sm:gap-8 flex-wrap justify-center lg:justify-start">
        <div className="relative h-56 w-56 sm:h-80 sm:w-80 flex-shrink-0">
          {/* pseudo-element via before: instead of decorative div */}
          <div className="absolute left-0 top-8 z-0 h-56 w-52 sm:h-80 sm:w-72 rotate-3 rounded-shape-main border-4 border-maroon-600 before:content-['']" />

          <div className="relative left-7 top-12 z-10 h-56 sm:h-80">
            <Image
              src={images.main}
              alt="Main gift box"
              fill
              priority
              className="rounded-shape-main object-cover"
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2 pl-5">
          {images.small.map((src, index) => (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden",
                index === 0 ? "h-32 w-32 sm:h-48 sm:w-48" : "h-24 w-32 sm:h-36 sm:w-48"
              )}
            >
              <Image
                src={src}
                alt="Small gift"
                fill
                className={cn(
                  "object-cover",
                  index === 1 ? "rounded-shape-alt" : "rounded-full"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-center space-y-4">
        <div>
          <h2 className="pb-4 text-sm font-bold uppercase tracking-wider text-softPink-500 dark:text-maroon-400">
            {t("title")}
          </h2>

          <h3 className="mb-2 text-3xl font-bold leading-none text-maroon-700 dark:text-softPink-200">
            {t("heading.beforeFinest")}{" "}
            <span className="text-softPink-500 dark:text-maroon-400">
              {t("heading.finest")}
            </span>{" "}
            {t("heading.beforeSpecial")}{" "}
            <span className="text-softPink-500 dark:text-maroon-400">
              {t("heading.special")}
            </span>{" "}
            {t("heading.afterSpecial")}
          </h3>

          <p className="text-base leading-none text-zinc-500">
            {t("description")}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/products"
            className="flex w-fit items-center gap-3 rounded-lg bg-maroon-600 dark:bg-softPink-200 px-6 py-2 text-white dark:text-zinc-800"
          >
            <span className="text-sm font-semibold">{t("button")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-50"
            >
              <Check className="h-4 w-4 stroke-[0.20rem] text-maroon-700 dark:text-softPink-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
