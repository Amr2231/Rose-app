import { Suspense } from "react";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import WishlistList from "./_components/wishlist-list";
import WishlistSkeleton from "./_components/wishlist-skeleton";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  const t = useTranslations("wishlist");

  return (
    <main className="px-4 sm:px-8 lg:px-16 py-8">
      <h1 className="font-bold text-2xl sm:text-4xl text-zinc-800 mb-6">
        {t("title")}
      </h1>
      <Suspense fallback={<WishlistSkeleton />}>
        <WishlistList />
      </Suspense>
    </main>
  );
}
