import React, { Suspense } from "react";
import ProductDetails from "./_components/product-details";
import ProductDetailsSkeleton from "./_components/product-details-skeleton";
import ProductReviews from "../_components/product-review/product-review";
import RelatedProductsSection from "../_components/related-prod/related-product";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      {/* Product Details */}
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails id={id} />
      </Suspense>

      <div className="container mx-auto px-4 sm:px-8 lg:px-20">
        {/* Reviews */}
        <ProductReviews productId={id} />

        {/* Related Products */}
        <RelatedProductsSection productId={id} />
      </div>
    </>
  );
}
