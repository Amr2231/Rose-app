import SyncGuestCart from "@/components/shared/sync-guest-cart";
import CartData from "./_components/cart-data/cart-data";

export default function page() {
  return (
    <>
      <SyncGuestCart />
      <CartData />
    </>
  );
}
