import { createProduct } from "@/lib/actions/create-product.actions";
import { ProductFields } from "@/lib/types/product";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function useCreateProduct() {
  // translations
  const t = useTranslations("create-product");
  // router
  const router = useRouter();
  // Toaser
  const { toast } = useToast();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async (values: ProductFields) => {
      // handle data
      const formData = new FormData();
      formData.append("title", String(values.title));
      formData.append("description", String(values.description));
      formData.append("price", String(values.price));
      formData.append("quantity", String(values.quantity));
      formData.append("category", String(values.category));
      formData.append("occasion", String(values.occasion));
      // calculate price after disccount
      if (values.discount) {
        formData.append("discount", String(values.discount));
        formData.append(
          "priceAfterDiscount",
          String(values.price - values.discount)
        );
      }
      // handle one image
      if (values.imageCover) {
        formData.append("imgCover", values.imageCover);
      }
      // handle one or more images
      if (values.gallery && values.gallery.length > 0) {
        values.gallery.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      const response = await createProduct(formData);

      if (response?.error) {
        throw new Error(response?.error || "Created failed");
      }

      return response;
    },
    // if success
    onSuccess: () => {
      toast({
        title: t("on-success-title"),
        description: t("on-success-description"),
        variant: "success",
      });
      router.push("/dashboard/products")
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

  return { createProduct: mutate, error, isPending };
}
