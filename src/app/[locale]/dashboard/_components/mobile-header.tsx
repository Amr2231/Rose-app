"use client";

import Image from "next/image";
import UserAvatar from "./sidebar/user-avatar";
import { SidebarDropdown } from "./sidebar/sidebar-dropdown";
import { useCurrentUser } from "../_hooks/use-current-user";
import ToggleLanguage from "@/components/features/toggle-language";
import ThemeToggle from "@/components/features/theme-toggle";

export default function MobileHeader() {
  const { user } = useCurrentUser();

  return (
    <div className="lg:hidden flex items-center justify-between gap-3 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <Image
        src="/images/logo1.svg"
        alt="Rose App Logo"
        width={40}
        height={0}
        className="shrink-0"
      />
      <div className="flex items-center gap-3 shrink-0">
        <ToggleLanguage />
        <ThemeToggle />
        <UserAvatar user={user} />
        <SidebarDropdown user={user} />
      </div>
    </div>
  );
}
