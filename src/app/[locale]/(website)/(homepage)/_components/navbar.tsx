"use client";
import { cn } from "@/lib/utils/tailwind-merge";
import { ClipboardList, Gift, Home, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("navbar");
  const pathname = usePathname();

  const navItems = [
    {
      text: t("home"),
      href: "/",
      icon: <Home />,
    },
    {
      text: t("products"),
      href: "/products",
      icon: <Gift />,
    },
    {
      text: t("orders"),
      href: "/orders",
      icon: <ClipboardList />,
    },
    {
      text: t("about"),
      href: "/about",
      icon: <Info />,
    },
  ];

  return (
    <nav className="dark:bg-softPink-200 dark:text-zinc-800 bg-maroon-700 text-zinc-50 py-2 px-2 sm:py-3 sm:px-5 shadow-md mb-4 text-xs sm:text-base">
      <ul className="grid grid-cols-4 sm:flex sm:items-center sm:justify-center gap-1 sm:gap-8 mx-auto">
        {navItems.map((item, index) => {
          const cleanPath = pathname.replace(/^\/(en|ar)/, "") || "/";
          const isActive =
            item.href === "/"
              ? cleanPath === "/"
              : cleanPath.startsWith(item.href);
          return (
            <li
              key={index}
              className={cn(
                "flex justify-center hover:border-b-2 hover:border-zinc-50 dark:hover:border-zinc-800 hover:font-semibold transition-all pb-1 shrink-0",
                isActive &&
                  "border-b-2 border-zinc-50 dark:border-zinc-800 font-semibold",
              )}
            >
              <Link
                className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6"
                href={item.href}
              >
                {item.icon} <span>{item.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
