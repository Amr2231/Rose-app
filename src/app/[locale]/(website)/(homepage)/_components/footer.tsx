"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const t = useTranslations("footer");
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  // Only pages that actually exist link out; the rest aren't built yet so
  // showing them as clickable would just be a dead end for visitors.
  const footerItems = [
    { title: t("links.home"), href: "/" },
    { title: t("links.products"), href: "/products" },
    { title: t("links.categories"), href: "/products" },
    { title: t("links.occasions"), href: "/products" },
    { title: t("links.about"), href: "/about" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      toast({
        description: t("invalidEmail"),
        variant: "destructive",
      });
      return;
    }

    toast({
      description: t("subscribeSuccess"),
      variant: "success",
    });
    setEmail("");
  };

  return (
    <footer className="bg-zinc-800 dark:bg-zinc-900 ">
      <div className="container w-[95%] mx-auto py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-4">
        <div className="flex flex-col justify-center items-center text-center">
          <Image
            src="/images/logo1.svg"
            alt="Rose Logo"
            width={240}
            height={225}
            className="my-4"
          />
          <h3 className="text-softPink-300 font-bold text-lg">
            {t("appName")}
          </h3>
          <p className="text-zinc-100 mb-4 font-normal text-sm">
            {t("rights")}
          </p>
        </div>
        <div className="flex flex-col pt-5 ">
          <h3 className="text-softPink-300 font-bold text-lg">
            {t("discoverTitle")}
          </h3>
          <ul>
            {footerItems.map((item, index) => (
              <li
                key={index}
                className="text-zinc-100 font-normal text-sm -mt-1 hover:text-softPink-200 transition-all"
              >
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col pt-5">
          <h3 className="text-softPink-300 font-semibold text-xl">
            {t("discountHeading")}
            <span className="text-maroon-50 dark:text-zinc-300 font-semibold">
              {" "}
              {t("discountPercent")}
            </span>{" "}
            {t("discountSuffix")}
          </h3>
          <p className="text-zinc-500 text-sm -mt-2">
            {t("newsletterSubtitle")}
          </p>
          <form onSubmit={handleSubscribe} className="relative w-full max-w-80">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="mt-5 h-9 bg-zinc-600 py-2 px-4 rounded-full w-full z-0 focus:outline-none placeholder:text-zinc-400 text-sm"
            />
            <button
              type="submit"
              className="dark:bg-softPink-300 absolute end-0 top-1 mt-4 bg-maroon-50 text-maroon-700 py-2 px-3 sm:px-4 w-auto sm:w-32 h-9 rounded-full flex items-center gap-1 sm:gap-2 justify-center hover:bg-softPink-200 hover:text-zinc-800 dark:text-zinc-300 transition-all text-xs sm:text-sm"
            >
              {t("subscribe")} <ArrowRight size={16} />{" "}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
