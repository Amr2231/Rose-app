import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getAllReviews } from "@/lib/services/reviews.service";
import { Review } from "@/lib/types/review";
import { cn } from "@/lib/utils/tailwind-merge";
import Image from "next/image";

// Component
export default async function ReviewList({ productId }: { productId: string }) {
  // Translations
  const t = await getTranslations("reviews");

  // Data
  const response = await getAllReviews();
  const reviews: Review[] = response?.reviews ?? [];

  // Filter — handles `product` being either a populated object
  // ({ _id, title, ... }) or a plain id string.
  const productReviews = reviews.filter((review) => {
    const reviewProductId =
      typeof review.product === "string"
        ? review.product
        : review.product?._id;
    return reviewProductId === productId;
  });

  // No reviews
  if (productReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
        <svg
          viewBox="0 0 220 180"
          className="w-40 h-32 sm:w-44 sm:h-36"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* decorative dots */}
          <circle cx="24" cy="34" r="4" fill="#E9C2C9" />
          <circle cx="196" cy="42" r="3" fill="#E9C2C9" />
          <circle cx="34" cy="146" r="3" fill="#E9C2C9" />

          {/* speech bubble */}
          <path
            d="M45 40 h130 a12 12 0 0 1 12 12 v55 a12 12 0 0 1 -12 12 H95 l-22 20 v-20 H45 a12 12 0 0 1 -12 -12 V52 a12 12 0 0 1 12 -12 Z"
            fill="#FDF1F2"
            stroke="#D98A96"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* stars inside bubble */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              transform={`translate(${68 + i * 22} 68) scale(0.9)`}
              d="M8 0 L10.4 5.3 L16 5.9 L11.8 9.7 L13 15.2 L8 12.3 L3 15.2 L4.2 9.7 L0 5.9 L5.6 5.3 Z"
              fill="#C4596A"
              opacity="0.55"
            />
          ))}
        </svg>

        <div className="space-y-1">
          <p className="text-base font-semibold text-maroon-700">
            {t("noReviews")}
          </p>
          <p className="text-sm text-zinc-500 max-w-xs">
            {t("noReviewsSubtitle")}
          </p>
        </div>
      </div>
    );
  }

  // Render
  return (
    <div className="max-w-[650px] max-h-[600px] overflow-y-auto pr-4 space-y-6">
      {productReviews.map((review, index) => (
        <div
          key={review._id}
          className={cn(index !== 0 && "pt-6 border-t border-gray-200 dark:border-zinc-700")}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-2">
            <Image
              src={review.user.photo}
              alt={review.user.firstName}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold dark:text-zinc-50">
                {review.user.firstName} {review.user.lastName}
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(review.createdAt))}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < review.rating
                    ? "fill-amber-500 text-amber-500"
                    : "text-gray-300 dark:text-zinc-600"
                )}
              />
            ))}
            {/* Rating count */}
            <span className="text-xs text-gray-500 dark:text-zinc-400 ml-1">
              ({review.rating})
            </span>
          </div>

          {/* Review Content */}
          <h4 className="text-sm font-semibold mb-1 dark:text-zinc-50">{review.title}</h4>
          <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
