"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  BrushCleaning,
  MoveLeft,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { InfiniteData } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import EmptyCartCard from "../empty-cart-card/empty-cart-card";
import type { AddToCartItem } from "@/lib/types/cart";
import type { Product } from "@/lib/types/product";
import BestSelling from "../best-selling/best-selling";
import Image from "next/image";
import Summary from "@/components/shared/summary";
import { normalizeProduct } from "@/lib/utils/normalize-product";

type ProductsPage = {
  products: Product[];
  nextPage?: number;
};

export default function CartGuestData() {
  // state
  const [cartItems, setCartItems] = useState<AddToCartItem[]>([]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // translations
  const t = useTranslations("cart");

  // varaiable
  const PAGE_SIZE = 2;

  // functions
  // fetch products details for guest cart items
  async function fetchProducts({ pageParam = 0 }: { pageParam: number }) {
    const start = pageParam * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageIds = ids.slice(start, end);

    // use promise.all to fetch all products in parallel
    const results = await Promise.all(
      pageIds.map(async (id) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/products/${id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        return normalizeProduct(data.payload);
      }),
    );

    return {
      products: results,
      nextPage: end < ids.length ? pageParam + 1 : undefined,
    };
  }

  // clear cart
  function clearCart() {
    localStorage.removeItem("guest-cart");
    setCartItems([]);
  }

  // increase quantity
  const increaseQuantity = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product === id
          ? { ...item, quantity: (item.quantity ?? 1) + 1 }
          : item,
      );
      localStorage.setItem("guest-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // decrease quantity
  const decreaseQuantity = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product === id
          ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 1) }
          : item,
      );
      localStorage.setItem("guest-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // remove product
  const removeProduct = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product !== id);
      localStorage.setItem("guest-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // get product by id
  const ids = cartItems.map((item) => item.product);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<
    ProductsPage,
    Error,
    InfiniteData<ProductsPage>,
    (string | string[])[],
    number
  >({
    queryKey: ["guest-cart-products", ids],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
    initialPageParam: 0,
    enabled: ids.length > 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // effects
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // get data from lcoastorage and check it no data
  useEffect(() => {
    const stored = localStorage.getItem("guest-cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  if (cartItems.length > 0 && isLoading) return <div> {t("loading")} </div>;
  if (cartItems.length > 0 && isError) return <div>Error loading products</div>;

  // guest cart subtotal (price * quantity for every fetched product)
  const guestSubtotal =
    data?.pages.reduce(
      (sum, page) =>
        sum +
        page.products.reduce((pageSum, product: Product) => {
          const cartItem = cartItems.find(
            (item) => item.product === product._id,
          );
          return pageSum + product.price * (cartItem?.quantity ?? 1);
        }, 0),
      0,
    ) ?? 0;

  return (
    <>
      <div className="px-4 sm:px-8 lg:px-20">
        {cartItems.length === 0 ? (
          <EmptyCartCard productCount={cartItems.length} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[48rem]">
            {/* cart header */}
            <div className="cart-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 w-full">
              <div className="text-2xl sm:text-3xl lg:text-5xl text-zinc-800 dark:text-zinc-50 font-bold">
                {t("title")}
                <span className="text-zinc-500 dark:text-zinc-400 font-normal text-sm sm:text-base ms-2">
                  {cartItems.length} {t("products")}
                </span>
              </div>
              <Button
                variant="light"
                onClick={clearCart}
                className="capitalize"
              >
                <BrushCleaning size={20} /> {t("empty")}
              </Button>
            </div>
            {/* cart body */}
            <Card className="w-full">
              <CardContent className="max-h-[32rem] overflow-y-auto hide-scrollbar">
                {data?.pages.map((page) =>
                  page.products.map((product: Product) => {
                    const cartItem = cartItems.find(
                      (item) => item.product === product._id,
                    );

                    return (
                      <div
                        key={product._id}
                        className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b py-4"
                      >
                        <div className="flex items-center gap-4">
                          {/* cart item image */}
                          <Image
                            src={product.imgCover}
                            alt={product.title}
                            width={100}
                            className="rounded h-24 w-24 sm:h-32 sm:w-32 object-cover shrink-0"
                          />
                          <div className="flex flex-col justify-between items-start h-24 sm:h-32 ">
                            {/* cart item title and rating */}
                            <div>
                              <p className="font-semibold text-lg text-start  text-maroon-600 capitalize pb-2">
                                {product.title}
                              </p>
                              <div className="font-normal text-start text-base flex items-center gap-1">
                                <Star
                                  className="text-amber-500  fill-amber-500"
                                  size={20}
                                />
                                {t("rating")}:
                                <span className="font-medium">
                                  {product.rateAvg}
                                </span>
                                <span className="text-blue-600 font-medium text-base ms-2">
                                  ({product.rateCount} {t("ratings")})
                                </span>
                              </div>
                            </div>

                            {/* cart item quantity and price */}
                            <p>
                              <span className="text-maroon-600 text-sm font-medium me-1">
                                (x{cartItem?.quantity})
                              </span>
                              <span className="font-bold text-2xl">
                                {product.price * (cartItem?.quantity ?? 1)}{" "}
                                {t("currency")}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* remove item  */}
                        <div className="flex flex-col justify-between items-start sm:items-end gap-2 h-auto sm:h-32 w-full sm:w-auto ps-0 sm:ps-4">
                          <Button
                            variant="destructive"
                            className="capitalize "
                            onClick={() =>
                              cartItem && removeProduct(cartItem?.product)
                            }
                          >
                            <Trash2 /> {t("remove-product")}
                          </Button>

                          {/* decrease quantity */}
                          <div className="flex items-center gap-2 ">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                cartItem && decreaseQuantity(cartItem?.product)
                              }
                              disabled={(cartItem?.quantity ?? 1) <= 1}
                            >
                              <Minus size={20} />
                            </Button>

                            {/* input value */}
                            <Input
                              type="number"
                              value={cartItem?.quantity ?? 1}
                              className="w-24 text-center p-4 border border-zinc-300 rounded-[1rem]"
                              readOnly
                            />

                            {/* increase quantity */}
                            <Button
                              variant="secondary"
                              onClick={() =>
                                cartItem && increaseQuantity(cartItem?.product)
                              }
                            >
                              <Plus size={20} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }),
                )}

                {/* loading on scroll */}
                {hasNextPage && (
                  <div
                    ref={loadMoreRef}
                    className="text-start py-6  text-zinc-500 dark:text-zinc-400"
                  >
                    {isFetchingNextPage ? t("loading") : ""}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* continue shopping button */}
            <div className="text-start py-6 w-full">
              <Button variant="destructive" className="capitalize">
                <MoveLeft size={20} />
                <Link href="/">{t("continue-shopping")}</Link>
              </Button>
            </div>
          </div>

          {/* order summary */}
          <div className="w-full lg:w-80 lg:sticky lg:top-24">
            <Summary subtotal={guestSubtotal} />
          </div>
          </div>
        )}

        {/* Best Selling carousel */}
        <BestSelling />
      </div>
    </>
  );
}
