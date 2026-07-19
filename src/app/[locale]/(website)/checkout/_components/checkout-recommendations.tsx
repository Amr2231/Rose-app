"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/shared/product-card";
import { useTranslations } from "next-intl";
import { normalizeProducts } from "@/lib/utils/normalize-product";

type ProductItem = {
  _id: string;
  imgCover?: string;
  image?: string;
  title?: string;
  price?: number;
  priceAfterDiscount?: number;
  quantity?: number;
  sold?: number;
  rateAvg?: number;
};

export default function CheckoutRecommendations() {
  const t = useTranslations("cart");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["personal-recommendations"],
    queryFn: async () => {
      const res = await fetch("/api/personal-product");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Failed to fetch");
      return json;
    },
    retry: false,
  });

  // Fallback: when recommendations fail or are empty, use a general
  // product list. NOTE: the documented GET /api/products filters are
  // page, limit, categoryId, subCategoryId, occasionId, minPrice, maxPrice,
  // minRating - there's no documented "sort" param (the old "-sold"
  // best-selling sort isn't supported), so it's dropped here rather than
  // risk the new API rejecting an unrecognized query param.
  const { data: fallbackData } = useQuery({
    queryKey: ["fallback-products"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/products?limit=6`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      // new backend wraps the list in { status, code, payload }; field
      // names (id/cover/gallery/stock/...) also differ, so normalize.
      const raw = json?.payload?.products ?? json?.payload ?? [];
      return { products: normalizeProducts(raw) };
    },
    enabled: !isLoading && (isError || !data?.products?.length),
  });

  const products: ProductItem[] =
    Array.isArray(data?.products) && data.products.length > 0
      ? data.products
      : Array.isArray(fallbackData?.products)
        ? fallbackData.products
        : [];

  const showCarousel = products.length > 0;

  return (
    <section className="col-span-1 lg:col-span-12 flex w-full flex-col gap-8 mt-10 mb-16 pt-8">
      <h2 className="text-lg font-semibold text-start uppercase mb-3 text-softPink-500">
        {t("products-you-may-like")}
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          <div className="h-72 w-full rounded-md bg-zinc-200" />
          <div className="h-72 w-full rounded-md bg-zinc-200" />
          <div className="h-72 w-full rounded-md bg-zinc-200" />
        </div>
      ) : !showCarousel ? null : (
        <Carousel opts={{ align: "start" }} className="w-full max-w-full">
          <CarouselContent className="ml-0 h-full flex gap-4">
            {products.map((product: ProductItem) => (
              <CarouselItem
                key={product._id}
                className="md:basis-1/2 lg:basis-1/3 flex-shrink-0"
              >
                <ProductCard
                  id={product._id}
                  img={product.imgCover ?? product.image ?? ""}
                  title={product.title ?? ""}
                  price={product.price ?? 0}
                  priceAfterDiscount={
                    product.priceAfterDiscount ?? product.price ?? 0
                  }
                  quantity={product.quantity ?? 0}
                  sold={product.sold ?? 0}
                  rateAvg={product.rateAvg ?? 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-maroon-600 absolute text-white hover:bg-maroon-700 hover:text-white top-40 -left-0" />
          <CarouselNext className="bg-maroon-600 absolute text-white hover:bg-maroon-700 hover:text-white top-40 -right-3" />
        </Carousel>
      )}
    </section>
  );
}
