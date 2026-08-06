import {
  addWishlist,
  checkWishlist,
  removeWishlist,
} from "@/lib/actions/wishlist.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useToast } from "./use-toast";

// add all the items in DB through API request
export async function syncLocalWishlistToAPI() {
  const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  if (localWishlist.length === 0) return;

  for (const productId of localWishlist) {
    try {
      await addWishlist({ productId });
    } catch (err) {
      console.error("Failed to sync product:", productId, err);
    }
  }

  localStorage.removeItem("wishlist");
}

// toggle between add and remove.
export default function useToggleWishlist(productId: string) {
  const { status } = useSession();
  const t = useTranslations();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist", productId],
    queryFn: () => checkWishlist(productId),
    // only check wishlist status for logged-in users with a real product id,
    // guests rely on localStorage
    enabled: status === "authenticated" && Boolean(productId),
  });

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      if (data?.inWishlist) {
        return removeWishlist(data.wishlistItemId as string);
      } else {
        return addWishlist({ productId });
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", productId] });
      if (data?.inWishlist) {
        toast({
          title: t("toast.success"),
          description: t("remove-from-wishlist"),
          variant: "success",
        });
      } else {
        toast({
          title: t("toast.success"),
          description: t("add-to-wishlist"),
          variant: "success",
        });
      }
    },

    onError: (error: Error) => {
      toast({
        title: t("toast.error"),
        description: error?.message || t("error-handler.description"),
        variant: "destructive",
      });
    },
  });

  return { mutation, data, isLoading };
}
