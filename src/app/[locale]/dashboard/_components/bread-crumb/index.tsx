"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useBreadcrumb } from "./breadcrumb-context";

export default function DashboardBreadcrumb() {
  const locale = useLocale();
  const pathname = usePathname();
  const { customLast } = useBreadcrumb();

  let segments = pathname.split("/").filter(Boolean);

  if (segments[0] === locale) segments = segments.slice(1);
  if (customLast) segments = segments.slice(0, -1);

  const formatSegment = (segment: string) => {
    return segment.split("-").join(" ");
  };

  return (
    <div className="flex items-center gap-2 p-5 border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 capitalize border-zinc-100 dark:border-zinc-800">
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <span key={href} className="flex items-center gap-2">
              {isLast && customLast ? (
                <span className="text-maroon-600">{customLast}</span>
              ) : isLast ? (
                <span className="text-maroon-600">
                  {formatSegment(segment)}
                </span>
              ) : (
                <>
                  <Link
                    href={href}
                    className="text-gray-500 dark:text-zinc-400 hover:text-maroon-600 transition-colors"
                  >
                    {formatSegment(segment)}
                  </Link>
                  <span className="text-gray-400 dark:text-zinc-500">{">"}</span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
