"use client";
import { useToast } from "@/hooks/use-toast";
import { addToCartAction } from "@/lib/actions/cart.actions";
import { AddToCartItem } from "@/lib/types/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";

export function useAddToCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (item: AddToCartItem) => {
      if (session.status !== "authenticated") {
        throw new Error("UNAUTHENTICATED");
      }
      return await addToCartAction(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Product added to cart successfully ",
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      if (err instanceof Error && err.message === "UNAUTHENTICATED") {
        toast({
          title: "Please log in to add products to your cart",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }
      toast({
        title: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending };
}
