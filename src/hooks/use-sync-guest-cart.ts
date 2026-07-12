// import { useToast } from "@/hooks/use-toast";
// import { useSession } from "next-auth/react";
// import { AddToCartItem } from "../lib/types/cart";
// import { addToCartAction } from "../lib/actions/cart.actions";

// export function useSyncGuestCart() {
//   const { status } = useSession();
//   const { toast } = useToast();

//   if (status !== "authenticated") return;

//   const guestCartStr = localStorage.getItem("guest-cart");
//   if (!guestCartStr) return; // no guest cart

//   const guestCart: AddToCartItem[] = JSON.parse(guestCartStr);

//   if (guestCart.length === 0) return;

//   (async () => {
//     try {
//       // Send all items in parallel
//       await Promise.all(guestCart.map((item) => addToCartAction(item)));

//       // Clear guest cart after successful sync
//       localStorage.removeItem("guest-cart");

//       toast({
//         title: "Your previous cart items have been added to your account",
//         variant: "success",
//       });
//     } catch (error) {
//       console.error("Failed to sync guest cart:", error);
//       toast({
//         title: "Failed to sync guest cart",
//         variant: "destructive",
//       });
//     }
//   })();
// }

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { addToCartAction } from "@/lib/actions/cart.actions";
import { AddToCartItem } from "@/lib/types/cart";

export function useSyncGuestCart() {
  const { status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    // Only run when the user is authenticated
    if (status !== "authenticated") return;

    const guestCartStr = localStorage.getItem("guest-cart");
    if (!guestCartStr) return; // no guest cart

    const guestCart: AddToCartItem[] = JSON.parse(guestCartStr);

    if (guestCart.length === 0) return;

    // Sync guest cart items to server
    (async () => {
      try {
        // Send all items in parallel
        await Promise.all(guestCart.map((item) => addToCartAction(item)));

        // Clear guest cart after successful sync
        localStorage.removeItem("guest-cart");

        toast({
          title: "Your previous cart items have been added to your account",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to sync guest cart:", error);
        toast({
          title: "Failed to sync guest cart",
          variant: "destructive",
        });
      }
    })();
  }, [status, toast]);
}
