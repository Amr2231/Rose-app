import Image from "next/image";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("not-found");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center">
      <div className="relative w-full max-w-md h-96">
        <Image
          src="/assets/404.jpg"
          alt="404 Not Found"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div>
        <p className="text-3xl font-semibold mb-4">{t("title")}</p>
        <p className="text-xl font-normal text-zinc-400 dark:text-gray-400 leading-[1.5]">
          {t("description")}
        </p>
      </div>
    </div>
  );
}