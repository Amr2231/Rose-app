import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function EmptyWishlist() {
  const t = await getTranslations("wishlist");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
      <svg
        viewBox="0 0 220 180"
        className="w-40 h-32 sm:w-48 sm:h-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* decorative dots */}
        <circle cx="20" cy="30" r="4" fill="#E9C2C9" />
        <circle cx="200" cy="40" r="3" fill="#E9C2C9" />
        <circle cx="30" cy="150" r="3" fill="#E9C2C9" />
        <path d="M185 130 l6 6 m0 -6 l-6 6" stroke="#E9C2C9" strokeWidth="2" />

        {/* back shadow heart */}
        <path
          d="M110 135 C70 105 45 85 45 58 C45 38 60 25 78 25 C92 25 103 33 110 45 C117 33 128 25 142 25 C160 25 175 38 175 58 C175 85 150 105 110 135 Z"
          fill="#F6DCE0"
          transform="rotate(-4 110 80) translate(4 8)"
        />

        {/* front heart outline */}
        <path
          d="M110 135 C70 105 45 85 45 58 C45 38 60 25 78 25 C92 25 103 33 110 45 C117 33 128 25 142 25 C160 25 175 38 175 58 C175 85 150 105 110 135 Z"
          fill="#FDF1F2"
          stroke="#D98A96"
          strokeWidth="2.5"
          strokeDasharray="7 6"
        />

        {/* little sparkle */}
        <path
          d="M155 100 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z"
          fill="#C4596A"
          opacity="0.55"
        />

        {/* face */}
        <circle cx="96" cy="70" r="2.5" fill="#7A2E3A" opacity="0.5" />
        <circle cx="124" cy="70" r="2.5" fill="#7A2E3A" opacity="0.5" />
        <path
          d="M100 80 q10 -8 20 0"
          stroke="#7A2E3A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      <div className="space-y-1 max-w-xs sm:max-w-sm">
        <p className="text-base sm:text-lg font-semibold text-maroon-700 dark:text-softPink-200">
          {t("empty")}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          {t("empty-subtitle")}
        </p>
      </div>

      <Link href="/products">
        <Button className="mt-2">{t("browse-products")}</Button>
      </Link>
    </div>
  );
}
