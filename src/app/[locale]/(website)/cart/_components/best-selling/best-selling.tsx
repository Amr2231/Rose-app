"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/shared/product-card";
import type { Product } from "@/lib/types/product";
import { normalizeProducts } from "@/lib/utils/normalize-product";

interface SearchParams {
  sort?: string;
  limit?: number;
  [key: string]: string | number | undefined;
}

export default function BestSelling({
  searchParams = { sort: "-sold", limit: 6 },
}: {
  searchParams?: SearchParams;
} = {}) {
  // transaltions
  const tBestSelling = useTranslations("best-selling");

  const { data, isLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["best-selling-products", searchParams],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        Object.entries(searchParams)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/products?${queryString}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      // new backend wraps the list in { status, code, payload }; field
      // names (id/cover/gallery/stock/...) also differ, so normalize.
      const raw = json?.payload?.products ?? json?.payload ?? [];
      return { products: normalizeProducts(raw) };
    },
  });

  const products = data?.products ?? [];

  return (
    <section className="flex w-full lg:max-w-[80rem] mx-auto flex-col gap-8 mt-10 mb-40 pt-8 ">
      <h2 className="text-lg font-semibold text-start  uppercase mb-3 text-softPink-500">
        {tBestSelling("title")}
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          <div className="h-72 w-full rounded-md bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-72 w-full rounded-md bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-72 w-full rounded-md bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ) : products.length ? (
        <Carousel opts={{ align: "start" }} className="w-full h-full">
          <CarouselContent className="ml-0 h-full flex">
            {products.map((product) => (
              <CarouselItem
                key={product._id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <ProductCard
                  id={product._id}
                  img={product.imgCover}
                  title={product.title}
                  price={product.price}
                  priceAfterDiscount={product.priceAfterDiscount}
                  quantity={product.quantity}
                  sold={product.sold}
                  rateAvg={product.rateAvg}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-maroon-600 absolute text-white hover:bg-maroon-700 hover:text-white top-40 -left-0" />
          <CarouselNext className="bg-maroon-600 absolute text-white hover:bg-maroon-700 hover:text-white top-40 -right-3" />
        </Carousel>
      ) : null}
    </section>
  );
}
