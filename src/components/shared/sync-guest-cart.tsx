// components/SyncGuestCart.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { AddToCartItem } from "@/lib/types/cart";
import { addToCartAction } from "@/lib/actions/cart.actions";

export default function SyncGuestCart() {
  const { status } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status !== "authenticated") return;

    const guestCartStr = localStorage.getItem("guest-cart");
    if (!guestCartStr) return;

    const guestCart: AddToCartItem[] = JSON.parse(guestCartStr);
    if (guestCart.length === 0) return;

    (async () => {
      try {
        // send all items in parallel
        await Promise.all(guestCart.map((item) => addToCartAction(item)));

        // clear guest cart and refresh cart query
        localStorage.removeItem("guest-cart");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } catch (err) {
      }
    })();
  }, [status, queryClient]);

  return null;
}
