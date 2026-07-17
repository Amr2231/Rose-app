import { CURRENCY } from "@/lib/constants/global.constant";
import { ShoppingCart, Star } from "lucide-react";
import AddToCartButton from "@/components/shared/add-to-cart-button";
import AddToWishlist from "@/components/shared/add-to-wishlist";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { useTranslations } from "next-intl";
import { Product } from "@/lib/types/product";

type ProductInfoProps = {
  product?: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations();
  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <h2 className="text-zinc-800 dark:text-zinc-50 text-2xl sm:text-3xl font-semibold break-words">
        {product?.title}
      </h2>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
        {/* Price */}
        <p className="text-2xl sm:text-3xl font-bold flex flex-wrap items-baseline gap-2 dark:text-zinc-50">
          <span className="text-zinc-300 dark:text-zinc-500 line-through">
            {product?.price}
          </span>
          <span>
            {product?.priceAfterDiscount} {CURRENCY}
          </span>
        </p>
        {/* Stock */}
        <div
          className={cn(
            "flex items-center gap-2 font-medium text-sm rounded-xl w-fit px-3 py-1.5 whitespace-nowrap",
            product && product.quantity > 0
              ? "bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-50"
              : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
          )}
        >
          <Package
            className={cn(
              "shrink-0",
              product && product.quantity > 0
                ? "text-zinc-400 dark:text-zinc-300"
                : "text-red-600 dark:text-red-400",
            )}
          />
          <span>
            {product && product.quantity > 0
              ? `${product.quantity} ${t("in-stock")}`
              : t("out-of-stock")}{" "}
          </span>
        </div>
      </div>
      {/* Rating */}
      <div className="flex flex-wrap items-center border-y border-y-zinc-100 dark:border-y-zinc-700 gap-x-2 gap-y-1 py-4 ps-1 my-4">
        <p className="flex items-center text-black dark:text-zinc-50 font-normal text-base">
          <Star
            className="border-none text-yellow-500 me-1"
            size={20}
            fill="#eab308 "
          />{" "}
          Rating :<span className="font-medium">{product?.rateAvg}/5</span>
        </p>
        <span className="text-blue-600 dark:text-blue-400 text-base font-medium">
          ({product?.rateCount} rating)
        </span>
      </div>
      {/* Description */}
      <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed font-normal max-h-48 overflow-y-auto hide-scrollbar ">
        {product?.description}
      </p>

      {/* Buttons  */}
      <div className="mt-6 lg:mt-auto flex items-center gap-4">
        <AddToWishlist productId={product?._id || ""} variant="inline" />

        <AddToCartButton
          className="w-full"
          productId={product ? product?._id : ""}
          quantityInStock={product ? product.quantity : 0}
        >
          <ShoppingCart /> {t("cart.add-to-cart")}
        </AddToCartButton>
      </div>
    </div>
  );
}
