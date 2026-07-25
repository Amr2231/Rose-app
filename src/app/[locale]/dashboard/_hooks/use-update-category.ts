"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/navigation";
import { updateCategoryAction } from "@/lib/actions/update-category.actions";
import { ActionCategoryResponse } from "@/lib/types/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCategory() {
  // Navigation
  const router = useRouter();
  // React Query client
  const queryClient = useQueryClient();
  // Toast
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { id: string; name: string }) => {
      return await updateCategoryAction(data.id, data.name);
    },

    onSuccess: (data: ActionCategoryResponse) => {
      const success = !!data.document;

      if (success) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }

      toast({
        description: success
          ? "Category has been updated successfully"
          : data.message,
        variant: success ? "success" : "destructive",
      });

      if (success) {
        setTimeout(() => {
          router.push("/dashboard/categories");
        }, 2000);
      }
    },

    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error?.message || "Failed to update category. Please try again.",
        variant: "destructive",
      });

      console.error("Update category error:", error);
    },
  });
}
