import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProducts } from "@/lib/services/products.service";
import ProductCard from "@/components/shared/product-card";
import { Product } from "@/lib/types/product";

export async function BestSellingCarousel() {
  // Queries
  // NOTE: "sort" isn't a documented query param on the new /api/products
  // endpoint (only page/limit/categoryId/subCategoryId/occasionId/minPrice/
  // maxPrice/minRating are). Dropped it here so the request doesn't get
  // rejected; "best selling" ordering will need a real sort param from the
  // backend (or a dedicated endpoint) to work again.
  const data = await getProducts({ limit: 6 });

  return (
    <Carousel opts={{ align: "start" }} className="w-full h-full">
      <CarouselContent className="ml-0 h-full flex">
        {data.products.map((product: Product) => (
          <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/3">
            {/* Single product card For each item*/}
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
  );
}
