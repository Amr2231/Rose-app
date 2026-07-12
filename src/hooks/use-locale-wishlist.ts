import { useState, useEffect } from "react";

export function useLocalWishlist(productId: string) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.includes(productId));
  }, [productId]);

  const toggleWishlistGuest = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (wishlist.includes(productId)) {
      // Remove
      const newWishlist = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      setIsInWishlist(false);
    } else {
      // Add
      wishlist.push(productId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(true);
    }
  };

  return { isInWishlist, toggleWishlistGuest };
}
