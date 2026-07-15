import OccasionsTabs from "./occasions-tabs";
import OccasionDetails from "./occasion-details";
import EmptyOccasionProducts from "./empty-occasion-products";
import ProductCard from "@/components/shared/product-card";
import { MoveRight } from "lucide-react";
import TitleOfSection from "@/components/shared/title-of-section";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MostPopularProductsProps } from "@/lib/types/product";

export default function MostPopular({
  occasions,
  initialOccasion,
  initialProducts,
}: MostPopularProductsProps) {
  // translation
  const t = useTranslations("most-popular");

  const activeOccasionData = occasions.find(
    (occasion) => occasion._id === initialOccasion
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TitleOfSection
          title={""}
          subtitle={t("title")}
          className="items-start py-0 text-start"
          subtitleClassName="text-2xl sm:text-3xl text-start"
        />
        <OccasionsTabs
          occasions={occasions}
          activeOccasion={initialOccasion}
        />
      </div>

      {initialProducts.products.length === 0 ? (
        <>
          <OccasionDetails occasion={activeOccasionData} />
          <EmptyOccasionProducts />
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {initialProducts.products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
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
      )}
      {initialProducts.products.length !== 0 && (
        <Link
          href={`/products`}
          className="flex gap-2 justify-end text-maroon-700 font-bold"
        >
          {t("view-more")} <MoveRight />
        </Link>
      )}
    </section>
  );
}
