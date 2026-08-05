import { getTranslations } from "next-intl/server";
import { RelatedProductsCarousel } from "./related-products-carousel";
import { getRelatedProducts } from "@/lib/services/related-products.service";

// Type
type RelatedProductsSectionProps = {
  productId: string;
};

// Component
export default async function RelatedProductsSection({
  productId,
}: RelatedProductsSectionProps) {
  const { similarProducts } = await getRelatedProducts(productId);

  // Nothing to show (no other products in the same category) - hide the
  // whole section instead of leaving a bare "Related Products" heading
  // with an empty carousel underneath it.
  if (!similarProducts.length) return null;

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

      <RelatedProductsCarousel products={similarProducts} />
    </section>
  );
}
