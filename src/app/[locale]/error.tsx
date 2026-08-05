"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function error() {
  // Translations
  const t = useTranslations("error-handler");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center">
      <div className="relative w-full max-w-md h-96">
        <Image
          src="/assets/server-down.jpg"
          alt="error "
          fill
          className="object-contain"
          priority
        />
      </div>
      <div>
        {/* alert titile */}
        <p className="text-3xl font-semibold mb-4">{t("title")}</p>

        {/* description title */}
        <p className="text-xl font-normal text-zinc-400  dark:text-gray-400 space-y-4 leading-[1.5]">
          {t("description")}
        </p>
      </div>
    </div>
  );
}
