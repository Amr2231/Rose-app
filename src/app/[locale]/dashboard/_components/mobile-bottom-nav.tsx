"use client";

import { cn } from "@/lib/utils/tailwind-merge";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarHeart,
  Package,
  Flower,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const NavItems = [
  {
    key: "overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    key: "categories",
    href: "/dashboard/categories",
    icon: ClipboardList,
  },
  // Center slot is the floating brand button - kept as a gap here so the
  // two items on each side stay evenly spaced around it.
  { key: "brand" as const },
  {
    key: "occasions",
    href: "/dashboard/occasions",
    icon: CalendarHeart,
  },
  {
    key: "products",
    href: "/dashboard/products",
    icon: Package,
  },
];

export default function MobileBottomNav() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();

  const isActiveRoute = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex items-center justify-between px-4">
        {NavItems.map((item) => {
          if (item.key === "brand") {
            return (
              <Link
                key="brand"
                href="/"
                aria-label={t("preview-website")}
                className="absolute left-1/2 -translate-x-1/2 -top-5 flex items-center justify-center w-14 h-14 rounded-full bg-maroon-600 text-white shadow-lg shadow-maroon-600/30 border-4 border-white"
              >
                <Flower className="w-6 h-6" />
              </Link>
            );
          }

          const Icon = item.icon!;
          const isActive = isActiveRoute(item.href!, item.exact);

          return (
            <Link
              key={item.key}
              href={item.href!}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 px-2 text-[11px] font-medium min-w-[3.5rem]",
                isActive ? "text-maroon-600" : "text-zinc-400 dark:text-zinc-500"
              )}
            >
              <Icon className="w-5 h-5" />
              {t(item.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
