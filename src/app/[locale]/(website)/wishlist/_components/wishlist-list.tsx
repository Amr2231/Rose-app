import ProductCard from "@/components/shared/product-card";
import EmptyWishlist from "./empty-wishlist";
import { getWishlist } from "@/lib/actions/wishlist.actions";

export default async function WishlistList() {
  const { wishlist } = await getWishlist();

  if (!wishlist?.length) return <EmptyWishlist />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {wishlist.map((product) => (
        <ProductCard
          key={product._id}
          id={product._id}
          img={product.imgCover}
          title={product.title}
          price={product.price}
          priceAfterDiscount={product.priceAfterDiscount ?? product.price}
          quantity={product.quantity}
          sold={product.sold}
          rateAvg={product.rateAvg}
        />
      ))}
    </div>
  );
}
