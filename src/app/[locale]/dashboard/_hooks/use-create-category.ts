"use client";

import { useToast } from "@/hooks/use-toast";
import { createCategoryAction } from "@/lib/actions/add-category.actions";
import { ActionCategoryResponse } from "@/lib/types/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export function useCreateCategory() {
  // React Query client
  const queryClient = useQueryClient();
  // Toast
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; image: File }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("image", data.image);
      return await createCategoryAction(formData);
    },

    onSuccess: (data: ActionCategoryResponse) => {
      const success = !!data.document;

      if (success) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }

      toast({
        description: success
          ? "Category has been added successfully"
          : data.message,
        variant: success ? "success" : "destructive",
      });
    },

    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error?.message || "Failed to add category. Please try again.",
        variant: "destructive",
      });
    },
  });
}
