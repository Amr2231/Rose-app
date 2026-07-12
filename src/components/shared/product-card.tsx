import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Rating from "@/components/ui/rating";
import ProductBadge from "./product-badge";
import { useTranslations } from "next-intl";
import AddToWishlist from "./add-to-wishlist";
import AddToCartButton from "./add-to-cart-button";
import { ShoppingCart } from "lucide-react";
import { ProductCardProps } from "@/lib/types/product";
import SafeImage from "./safe-image";

export default function ProductCard({
  id,
  img,
  title,
  price,
  priceAfterDiscount,
  quantity,
  sold,
  rateAvg,
}: ProductCardProps) {
  const t = useTranslations("product");

  return (
    <Card className="border-none shadow-none h-full dark:bg-zinc-800">
      <CardContent className="flex flex-col h-full px-1 p-0">
        {/* Product image */}
        <Link
          href={`/products/${id}`}
          className="relative w-full h-72 block overflow-hidden rounded-md"
        >
          <SafeImage
            src={img}
            alt={title}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <ProductBadge quantity={quantity} sold={sold} />
          <AddToWishlist productId={id || ""} />
        </Link>

        <div className="flex flex-col space-y-1 mt-2">
          {/* Product title */}
          <Link href={`/products/${id}`}>
            <p className="font-semibold capitalize text-lg text-maroon-600 line-clamp-1">
              {title}
            </p>
          </Link>

          <div className="flex justify-between items-center">
            {/* Rating and price */}
            <div className="flex flex-col">
              <Rating rate={rateAvg} />
              <span className="text-maroon-600 font-semibold">
                {priceAfterDiscount} {t("currency")}{" "}
                <span className="text-zinc-500 line-through">
                  {price} {t("currency")}
                </span>
              </span>
            </div>

            {/* Add to cart button */}
            <AddToCartButton
              className="flex justify-center items-center w-11 h-11 rounded-full"
              productId={id!}
              quantityInStock={quantity}
            >
              <ShoppingCart size={24} />
            </AddToCartButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
