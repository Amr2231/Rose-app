import { Star, StarHalf } from "lucide-react";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ReviewList from "./review-list";
import ReviewForm from "./review-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllReviews } from "@/lib/services/reviews.service";
import { Review } from "@/lib/types/review";

// Type
type ProductReviewsProps = {
  productId: string;
};

// Loading skeleton
function ReviewListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

// Stars renderer
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= Math.floor(rating) ? (
          <Star key={star} className="w-4 h-4 fill-amber-500 text-amber-500" />
        ) : rating % 1 >= 0.5 && star === Math.ceil(rating) ? (
          <StarHalf
            key={star}
            className="w-4 h-4 fill-amber-500 text-amber-500"
          />
        ) : (
          <Star key={star} className="w-4 h-4 text-gray-300 dark:text-zinc-600" />
        )
      )}
    </div>
  );
}

// Component
export default async function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const t = await getTranslations("reviews");

  // Fetch reviews and calculate rating
  const response = await getAllReviews();
  const allReviews: Review[] = response?.reviews ?? [];

  const productReviews = allReviews.filter((review) => {
    const reviewProductId =
      typeof review.product === "string"
        ? review.product
        : review.product?._id;
    return review.status === "approved" && reviewProductId === productId;
  });

  const ratingsCount = productReviews.length;
  const generalRating =
    ratingsCount > 0
      ? parseFloat(
          (
            productReviews.reduce((sum, r) => sum + r.rating, 0) / ratingsCount
          ).toFixed(1)
        )
      : 0;

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="relative mb-6">
        <h2 className="font-bold text-maroon-700 text-3xl after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-[9%] after:h-4 after:bg-softPink-100 after:-z-10 after:rounded-e-2xl">
          {t("title")}
        </h2>
        <div className="h-[2px] w-[3%] bg-softPink-600 mt-1" />
      </div>

      {/* General Rating */}
      <div className="mb-6">
        <p className="text-lg font-medium dark:text-zinc-50">{t("generalRating")}:</p>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl font-bold dark:text-zinc-50">{generalRating}</span>
          <span className="text-sm text-gray-400 dark:text-zinc-500">
            ({t("ratings", { count: ratingsCount })})
          </span>
        </div>
        <RatingStars rating={generalRating} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-zinc-700 mb-6" />

      {/* Reviews Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Reviews List */}
        <div className="w-full lg:flex-1 lg:max-w-[650px]">
          <Suspense fallback={<ReviewListSkeleton />}>
            <ReviewList productId={productId} />
          </Suspense>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-200 dark:bg-zinc-700 self-stretch" />
        <div className="block lg:hidden h-px bg-gray-200 dark:bg-zinc-700 w-full" />

        {/* Review Form */}
        <ReviewForm productId={productId} />
      </div>
    </section>
  );
}
