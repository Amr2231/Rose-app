import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/shared/product-card";
import { getRelatedProducts } from "@/lib/services/related-products.service";

// Type
type Props = {
  productId: string;
};

// Component
export async function RelatedProductsCarousel({ productId }: Props) {
  const data = await getRelatedProducts(productId);

  if (!data?.similarProducts?.length) return null;

  return (
    <Carousel opts={{ align: "start" }} className="w-full h-full">
      {/* Items */}
      <CarouselContent className="ml-0 h-full flex">
        {data.similarProducts.map((product: any) => {
          // The new backend returns cover/image as a full absolute URL
          // already - no base-URL prefix needed (see normalize-product.ts).
          const imageUrl = product.imgCover;

          // Render
          return (
            <CarouselItem
              key={product._id}
              className="md:basis-1/2 lg:basis-1/4"
            >
              {/* Product Card */}
              <ProductCard
                id={product._id}
                img={imageUrl}
                title={product.title}
                price={product.price}
                priceAfterDiscount={product.priceAfterDiscount}
                rateAvg={product.rateAvg}
                quantity={product.quantity}
                sold={product.sold}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* Arrows */}
      <CarouselPrevious className="bg-maroon-600 absolute text-white hover:bg-maroon-700 hover:text-white top-40 -left-0" />
      <CarouselNext className="bg-maroon-600 absolute text-white hover:bg-maroon-700 hover:text-white top-40 -right-3" />
    </Carousel>
  );
}
