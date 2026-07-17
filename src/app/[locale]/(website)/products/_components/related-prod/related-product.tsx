import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { RelatedProductsCarousel } from "./related-products-carousel";
import { Skeleton } from "@/components/ui/skeleton";

// Type
type RelatedProductsSectionProps = {
  productId: string;
};

// Loading skeleton
function CarouselSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-72 w-full rounded-md" />
      ))}
    </div>
  );
}

// Component
export default async function RelatedProductsSection({
  productId,
}: RelatedProductsSectionProps) {
  const t = await getTranslations("relatedProducts");

  return (
    <section className="flex w-full flex-col gap-8 mt-20 mb-20">
      {/* Section title */}
      <div className="relative">
        <h2 className="font-bold text-maroon-700 dark:text-softPink-200 text-3xl after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-[9%] after:h-4 after:bg-softPink-100 after:-z-10 after:rounded-e-2xl">
          {t("title")}
        </h2>
        <div className="h-0.5 w-[3%] bg-softPink-600 mt-1" />
      </div>

      {/* Carousel with Suspense */}
      <Suspense fallback={<CarouselSkeleton />}>
        <RelatedProductsCarousel productId={productId} />
      </Suspense>
    </section>
  );
}
