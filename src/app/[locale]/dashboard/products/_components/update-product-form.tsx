"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductUpdateFields } from "@/lib/types/product";
import { productUpdateSchema } from "@/lib/schemas/product.schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
// import { useOccasions } from "@/hooks/use-occasions";
import { useSingleProduct } from "@/hooks/use-single-product";
import useUpdateProduct from "@/hooks/use-update-product";
import { useOccasions } from "@/hooks/use-occasions";
import { ImageIcon, Images } from "lucide-react";

export default function UpdateProductForm(productId: { productId: string }) {
  // Translation
  const t = useTranslations("update-product");

  // Hooks
  const { data: productChosen } = useSingleProduct(productId.productId);
  const { updateProduct, error, isPending } = useUpdateProduct();

  // Queries
  const { data: categories } = useCategories();
  const { data: occasions } = useOccasions();

  // Form & validation
  const form = useForm<ProductUpdateFields>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discount: 0,
      priceAfterDiscount: 0,
      quantity: "",
      category: "",
      occasion: "",
    },
    resolver: zodResolver(productUpdateSchema(t)),
  });

  // Variables
  const price = form.watch("price");
  const discount = form.watch("discount");

  // Functions
  const onSubmit = async (values: ProductUpdateFields) => {
    updateProduct({ ...values, productId: productId.productId });
  };

  // Effects
  useEffect(() => {
    if (productChosen) {
      form.reset({
        title: productChosen.title,
        description: productChosen.description ?? "",
        price: productChosen.price ?? 0,
        discount: productChosen.discount ?? 0,
        priceAfterDiscount: productChosen.priceAfterDiscount ?? 0,
        quantity: productChosen.quantity != null ? String(productChosen.quantity) : "",
        category: productChosen.category ?? "",
        occasion: productChosen.occasion ?? "",
      });
    }
  }, [productChosen, form]);

  useEffect(() => {
    const afterDiscount = Number(price) - Number(discount);
    form.setValue("priceAfterDiscount", afterDiscount > 0 ? afterDiscount : 0);
  }, [price, discount, form]);

  return (
    <>
      {/* Page Title */}
      <h3 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 max-w-full sm:w-185 truncate">
        {t("update-product")}: {productChosen?.title}
      </h3>
      <section className="my-6 bg-white dark:bg-zinc-900 rounded-2xl p-6">
        <div className="w-full lg:w-[70%]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-6 gap-4"
            >
              {/* title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel className="after:content-['*'] after:text-red-600">
                      {t("title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("title-placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel className="after:content-['*'] after:text-red-600">
                      {t("description")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("description-placeholder")}
                        {...field}
                        className="min-h-36 max-h-36"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="after:content-['*'] after:text-red-600">
                      {t("price")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Example: 5000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* discount */}
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("discount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Example: 5000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price after Discount */}
              <FormField
                control={form.control}
                name="priceAfterDiscount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("price-after-discount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Example: 5000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Quantity  */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel className="after:content-['*'] after:text-red-600">
                      {t("quantity")} 
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Example: 1000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel className="after:content-['*'] after:text-red-600">
                      {t("category")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("category-placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.categories.map((category) => (
                          <SelectItem value={category._id} key={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Occasion */}
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel className="after:content-['*'] after:text-red-600">
                      {t("occasion")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("occasion-placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {occasions?.occasions.map((occasion) => (
                          <SelectItem value={occasion._id} key={occasion._id}>
                            {occasion.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-6 flex flex-col sm:flex-row sm:justify-end gap-2.5">
                <p className="text-blue-600 flex gap-1.5 items-center text-sm cursor-pointer hover:text-blue-800 transition-colors">
                  <ImageIcon size={18} /> View product cover
                </p>
                <p className="text-blue-600 flex gap-1.5 items-center text-sm cursor-pointer hover:text-blue-800 transition-colors">
                  <Images size={18} /> View product gallery
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-center mt-2">
                  {error.message}{" "}
                </p>
              )}
              <Button disabled={isPending} className="col-span-6 mt-20">
                {t("update-btn")}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}
