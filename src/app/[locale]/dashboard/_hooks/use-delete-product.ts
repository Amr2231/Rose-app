"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductAction } from "../_actions/products.actions";

export function useDeleteProduct(page: number) {
  // Queries
  const queryClient = useQueryClient();

  // Mutations
  return useMutation({
    mutationFn: (productId: string) => deleteProductAction(productId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["dashboard-products", page],
      });
    },
  });
}