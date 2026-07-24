"use client";

import { cn } from "@/lib/utils/tailwind-merge";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarHeart,
  Package,
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

export default function SidebarLinks() {
  // Translations
  const t = useTranslations("dashboard.sidebar");

  // Current pathname (without locale)
  const pathname = usePathname();

  // Active route matcher
  const isActiveRoute = (pathname: string, href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="flex flex-col space-y-3">
      {NavItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveRoute(pathname, item.href, item.exact);

        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex items-center gap-3 p-2 rounded font-medium transition-colors",
              isActive
                ? "bg-maroon-50 text-maroon-600"
                : "text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 hover:dark:bg-zinc-950 hover:text-zinc-900 hover:dark:text-zinc-50"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
