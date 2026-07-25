"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryAction } from "@/lib/actions/delete-category.actions";
import { useToast } from "@/hooks/use-toast";
import { ActionCategoryResponse } from "@/lib/types/category";

export function useDeleteCategory() {
  // React Query client
  const queryClient = useQueryClient();
  // Toast
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteCategoryAction(id);
      return res;
    },
    onSuccess: (data: ActionCategoryResponse) => {
      const success = !!data.document;

      if (success) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }

      toast({
        description: success
          ? "Category has been deleted successfully"
          : data.message,
        variant: success ? "success" : "destructive",
      });
    },
  });
}
