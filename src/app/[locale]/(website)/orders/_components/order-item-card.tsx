import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OrderItemCard({ item }: OrderItemCardProps) {
  // Translation
  const t = useTranslations("orders");
  // Variables
  const { product, quantity, price } = item;
  const rating = product.rateAvg ?? 0;
  const ratingCount = product.rateCount ?? 0;

  return (
    <div>
      <div className="flex gap-3 sm:gap-4 bg-white dark:bg-zinc-800 rounded-md p-2 transition-shadow duration-200">
        {/* Product Image */}
        <div className="w-20 h-20 sm:w-36 sm:h-36 relative shrink-0">
          <Image
            src={product.imgCover}
            alt={product.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          {/* Title */}
          <div className="min-w-0">
            <h3 className="text-maroon-700 dark:text-softPink-200 font-semibold text-sm sm:text-lg line-clamp-1">
              {product.title}
            </h3>
            {/* Rating */}
            <div className="flex flex-wrap items-center gap-1 text-xs sm:text-base">
              <Star size={14} className="text-yellow-500 fill-yellow-500 shrink-0" />
              <span className="font-medium whitespace-nowrap dark:text-zinc-50">
                {t("rating")}: {rating}/5
              </span>
              <span className="text-blue-600 dark:text-blue-400 whitespace-nowrap">
                ({ratingCount} {t("ratings-count")})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
            <span className="text-maroon-600 dark:text-softPink-300 text-xs sm:text-sm">
              (x{quantity})
            </span>

            <span className="font-bold text-base sm:text-lg text-zinc-800 dark:text-zinc-50">
              {price}
            </span>

            <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {t("currency")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
