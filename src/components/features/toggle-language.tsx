"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import React from "react";

export default function ToggleLanguage() {
  // translations hook
  const locale = useLocale();

  // navigation hooks
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    // Toggle between 'ar' and 'en'
    const newLocale = locale === "ar" ? "en" : "ar";
    router.push(pathname, { locale: newLocale });
  }
  return (
    // #TODO: Style the button
    <button onClick={toggleLocale} className="text-zinc-700 dark:text-zinc-50">
      {locale === "ar" ? "English" : "العربية"}
    </button>
  );
}
