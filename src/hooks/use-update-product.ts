import { updateProduct } from "@/lib/actions/update-product.actions";
import { ProductUpdateFields } from "@/lib/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useTranslations } from "next-intl";

type ProductMutationInput = ProductUpdateFields & { productId: string };

export default function useUpdateProduct() {
  //   translations
  const t = useTranslations("update-product");
  // Toaser
  const { toast } = useToast();
  // Queries
  const queryClient = useQueryClient();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async (fields: ProductMutationInput) => {
      const { productId, ...values } = fields;
      // handle data
      const formData = new FormData();
      formData.append("title", String(values.title));
      formData.append("description", String(values.description));
      formData.append("price", String(values.price));
      formData.append("quantity", String(values.quantity));
      formData.append("category", String(values.category));
      if (values.discount) {
        formData.append(
          "priceAfterDiscount",
          String(values.price - values.discount),
        );
      }

      const response = await updateProduct(formData, productId);

      if (response?.error) {
        throw new Error(response?.error || "Updated failed");
      }

      return response;
    },
    // if success
    onSuccess: () => {
      // Invalidate every cached dashboard-products list (all pages/search
      // terms) so the table shows the updated data when the user navigates
      // back to it.
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      toast({
        title: t("on-success-title"),
        description: t("on-success-description"),
        variant: "success",
      });
    },
    // if error
    onError: () => {
      toast({
        title: t("on-error-title"),
        description: t("on-error-description"),
        variant: "destructive",
      });
    },
  });

  return { updateProduct: mutate, error, isPending };
}
