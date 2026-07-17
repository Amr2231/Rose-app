import { getProducts } from "@/lib/services/products.service";
import ProductCard from "@/components/shared/product-card";
import PaginationWrapper from "@/components/ui/pagination-wrapper";
import { Product } from "@/lib/types/product";
import { buildProductQueryParams } from "@/lib/utils/product-search-params";
import { getTranslations } from "next-intl/server";

export default async function ProductList({
  searchParams,
}: ProductSearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("products-page");

  const data = await getProducts(buildProductQueryParams(resolvedSearchParams));

  const products = data?.products || [];
  const metadata = data?.metadata;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const PAGE_LIMIT = 12;

  const totalPages =
    products.length < PAGE_LIMIT
      ? currentPage
      : (metadata?.totalPages ?? currentPage);

  return (
    <>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
          <svg
            viewBox="0 0 220 180"
            className="w-40 h-32 sm:w-48 sm:h-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* decorative dots */}
            <circle cx="20" cy="30" r="4" fill="#E9C2C9" />
            <circle cx="200" cy="40" r="3" fill="#E9C2C9" />
            <circle cx="30" cy="150" r="3" fill="#E9C2C9" />
            <path
              d="M185 130 l6 6 m0 -6 l-6 6"
              stroke="#E9C2C9"
              strokeWidth="2"
            />

            {/* box back flap */}
            <path d="M60 70 L110 50 L160 70 L110 90 Z" fill="#F6DCE0" />
            {/* box body */}
            <rect
              x="65"
              y="70"
              width="90"
              height="60"
              rx="6"
              fill="#FDF1F2"
              stroke="#D98A96"
              strokeWidth="2"
            />
            {/* box seam */}
            <path
              d="M65 70 L110 90 L155 70"
              fill="none"
              stroke="#D98A96"
              strokeWidth="2"
            />
            <line
              x1="110"
              y1="90"
              x2="110"
              y2="130"
              stroke="#D98A96"
              strokeWidth="2"
            />

            {/* magnifier */}
            <circle
              cx="150"
              cy="105"
              r="18"
              fill="#FDF1F2"
              stroke="#C4596A"
              strokeWidth="3"
            />
            <line
              x1="162"
              y1="118"
              x2="176"
              y2="132"
              stroke="#C4596A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="142"
              y1="105"
              x2="158"
              y2="105"
              stroke="#C4596A"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-maroon-700">
              {t("empty")}
            </p>
            <p className="text-sm text-zinc-500 max-w-xs">
              {t("empty-subtitle")}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
            {products.map((product: Product) => (
              <ProductCard
                id={product._id}
                key={product._id}
                img={product.imgCover}
                title={product.title}
                price={product.price}
                priceAfterDiscount={product.priceAfterDiscount}
                quantity={product.quantity}
                sold={product.sold}
                rateAvg={product.rateAvg}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex mt-12 col-span-9">
              <PaginationWrapper
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
