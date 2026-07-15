import Image from "next/image";
import { useTranslations } from "next-intl";

export default function SecondSection() {
  const t = useTranslations("home.secondSection");

  // cards data (badges/titles come from translations, images stay static assets)
  const cards = [
    {
      img: "/assets/s1.png",
      title: t("wedding.title"),
      badge: t("wedding.badge"),
    },
    {
      img: "/assets/s2.png",
      title: t("engagement.title"),
      badge: t("engagement.badge"),
    },
    {
      img: "/assets/s3.png",
      title: t("anniversary.title"),
      badge: t("anniversary.badge"),
    },
  ];

  return (
    <section className="flex flex-col sm:flex-row items-stretch justify-between gap-4 sm:gap-6">
      {cards.map((item, idx) => (
        <div
          key={idx}
          className="relative flex-1 h-52 sm:h-68 overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-700"
        >
          <Image
            src={item.img}
            alt={item.title}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-r from-black/0 to-black/50 ">
            <span className="bg-white text-red-600 text-xs font-medium px-2 mb-2 rounded-full w-fit">
              {item.badge}
            </span>

            <h2 className="text-white text-lg sm:text-2xl font-semibold ">
              {item.title}
            </h2>
          </div>
        </div>
      ))}
    </section>
  );
}
