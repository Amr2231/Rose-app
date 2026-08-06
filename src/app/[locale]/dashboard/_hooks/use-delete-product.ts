"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductAction } from "../_actions/products.actions";
import { useToast } from "@/hooks/use-toast";
import { GetProductsResponse } from "@/lib/types/dashboard/product.d";

export function useDeleteProduct(page: number) {
  // Queries
  const queryClient = useQueryClient();
  // Toaster
  const { toast } = useToast();

  // Mutations
  return useMutation({
    mutationFn: (productId: string) => deleteProductAction(productId),
    onSuccess: (_data, productId) => {
      // Don't just rely on invalidateQueries + a refetch - remove the
      // deleted product from every cached dashboard-products list
      // directly, so the table updates immediately regardless of why a
      // background refetch might not be landing.
      queryClient.setQueriesData<GetProductsResponse>(
        { queryKey: ["dashboard-products"] },
        (old) =>
          old
            ? {
                ...old,
                products: old.products.filter((p) => p._id !== productId),
              }
            : old,
      );

      // Still invalidate so the counts/pagination reconcile with the
      // server on the next fetch.
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });
}
