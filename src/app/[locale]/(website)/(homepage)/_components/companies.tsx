"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const companyLogos = [
  { src: "/assets/coconut.png", alt: "coconut" },
  { src: "/assets/ginyard.png", alt: "ginyard" },
  { src: "/assets/ingoudeCompany.png", alt: "ingoudeCompany" },
  { src: "/assets/velvet.png", alt: "velvet" },
  { src: "/assets/ingoude.png", alt: "ingoude" },
  { src: "/assets/habus.png", alt: "habus" },
];

export default function Companies() {
  const t = useTranslations("companies");

  return (
    <section className="w-full">
      <div className="flex w-full flex-col items-center justify-between rounded-xl bg-maroon-50 p-5 sm:p-8 lg:p-10 dark:bg-zinc-700">
        <h2 className="pb-6 sm:pb-10 text-xl sm:text-2xl lg:text-3xl font-bold text-maroon-700 dark:text-softPink-200 text-center">
          {t("title")}{" "}
          <span className="text-softPink-500 dark:text-maroon-400">
            {t("count")}
          </span>{" "}
          {t("suffix")}
        </h2>

        <div className="flex w-full flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-6 sm:gap-y-8 transition-all duration-500">
          {companyLogos.map((logo, index) => (
            <div key={index} className="relative h-12 w-32">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
