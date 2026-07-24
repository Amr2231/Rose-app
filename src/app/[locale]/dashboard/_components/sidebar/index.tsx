"use client";
import Image from "next/image";
import { Flower } from "lucide-react";
import SidebarLinks from "./sidebar-links";
import { SidebarDropdown } from "./sidebar-dropdown";
import UserAvatar from "./user-avatar";
import { useCurrentUser } from "../../_hooks/use-current-user";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ToggleLanguage from "@/components/features/toggle-language";
import ThemeToggle from "@/components/features/theme-toggle";

export default function DashboardSidebar() {
  // Translations
  const t = useTranslations("dashboard.sidebar");
  //Queries
  const { user } = useCurrentUser();

  return (
    <div className="flex flex-col w-full h-full justify-between pt-8 pb-4 px-4 border-zinc-100 dark:border-zinc-800 ltr:border-r rtl:border-l">
      <div className="flex flex-col">
        <Image
          src="/images/logo1.svg"
          alt="Rose App Logo"
          width={150}
          height={0}
          className="m-auto"
        />
        <div className="flex items-center justify-center gap-4 py-2 mb-2">
          <ToggleLanguage />
          <ThemeToggle />
        </div>
        <Link
          href="/"
          className="flex items-center justify-center my-4 p-3 bg-maroon-600 text-white rounded-md hover:bg-maroon-700 transition-colors"
        >
          <span className="flex gap-2">
            <Flower /> {t("preview-website")}
          </span>
        </Link>
        <SidebarLinks />
      </div>
      <div className="flex gap-2 justify-center items-center">
        <div className="w-11 h-11 rounded-full flex items-center justify-center ">
          <UserAvatar user={user} />
        </div>
        <div className="flex flex-col text-sm">
          <span className="text-zinc-800 dark:text-zinc-100 flex gap-1 font-bold text-base ">
            <span>{user?.firstName}</span>
            <span>{user?.lastName}</span>
          </span>
          <span className="text-[#2E2E3080]">{user?.email}</span>
        </div>
        <SidebarDropdown user={user} />
      </div>
    </div>
  );
}
