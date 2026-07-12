"use client";

import { HeartMinus, HeartPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/tailwind-merge";
import useToggleWishlist, {
  syncLocalWishlistToAPI,
} from "@/hooks/use-toggle-wishlist";
import { useSession } from "next-auth/react";
import { useLocalWishlist } from "@/hooks/use-locale-wishlist";

type Props = {
  productId: string;
  variant?: "card" | "inline";
  className?: string;
};

export default function AddToWishlist({
  productId,
  variant = "card",
  className,
}: Props) {
  // Translation
  const t = useTranslations("");

  // Only trust client-only data (session, localStorage, cached query data)
  // once we're mounted — this keeps the very first client render identical
  // to what the server sent, avoiding a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Single hover flag; the label itself is derived from `active` at render
  // time so it can never get stuck showing the wrong action after a toggle.
  const [isHovering, setIsHovering] = useState(false);

  // context
  const { status } = useSession();

  // query
  const {
    mutation: toggleWishlist,
    data,
    isLoading,
  } = useToggleWishlist(productId);

  // in case guest
  const { isInWishlist, toggleWishlistGuest } = useLocalWishlist(productId);

  // function
  const handleToggle = async () => {
    if (!productId) return;
    // client
    if (status === "authenticated") {
      toggleWishlist.mutate();
    }
    // guest
    if (status === "unauthenticated") toggleWishlistGuest();
  };

  useEffect(() => {
    if (status === "authenticated") {
      syncLocalWishlistToAPI();
    }
  }, [status]);

  const active = mounted && Boolean(isInWishlist || data);

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading || !productId}
        aria-pressed={active}
        aria-label={
          active ? t("remove-from-wishlist") : t("add-to-wishlist")
        }
        className={cn(
          "shrink-0 p-3 rounded-lg transition-colors disabled:opacity-60",
          active
            ? "bg-maroon-50 text-maroon-600 dark:bg-zinc-700 dark:text-softPink-300"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600",
          className
        )}
      >
        {active ? (
          <HeartMinus size={20} strokeWidth={2.5} />
        ) : (
          <HeartPlus size={20} strokeWidth={2.5} />
        )}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "rounded-full h-8 flex rtl:flex-row-reverse items-center justify-center absolute top-2 left-2 px-2",
          active
            ? "bg-black dark:bg-zinc-800 text-white"
            : "bg-white dark:bg-zinc-800 text-maroon-600 dark:text-softPink-300"
        )}
      >
        {active ? (
          <HeartMinus size={18} strokeWidth={2.5} />
        ) : (
          <HeartPlus size={18} strokeWidth={2.5} />
        )}
        {isHovering && (
          <span className="px-1 text-xs font-medium">
            {active ? t("remove-from-wishlist") : t("add-to-wishlist")}
          </span>
        )}
      </button>
    </div>
  );
}
