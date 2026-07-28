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
import { ProductFields } from "@/lib/types/product";
import { productSchema } from "@/lib/schemas/product.schema";
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
import { InputImage } from "@/components/ui/input-image";
import { useEffect } from "react";
import useCreateProduct from "@/hooks/use-create-product";
import { useCategories } from "@/hooks/use-categories";
import { useOccasions } from "@/hooks/use-occasions";

export default function CreateProductForm() {
  // Translation
  const t = useTranslations("create-product");

  // Hooks
  const form = useForm<ProductFields>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discount: 0,
      priceAfterDiscount: 0,
      quantity: "",
      imageCover: undefined,
      gallery: undefined,
      category: "",
      occasion: "",
    },
    resolver: zodResolver(productSchema(t)),
  });

  // Queries
  const { data: categories } = useCategories();
  const { data: occasions } = useOccasions();

  // Mutation
  const { createProduct, error, isPending } = useCreateProduct();

  // Form & validation
  const price = form.watch("price");
  const discount = form.watch("discount");

  // Functions
  const onSubmit = async (values: ProductFields) => {
    createProduct(values);
  };

  // Effects
  useEffect(() => {
    const afterDiscount = Number(price) - Number(discount);
    form.setValue("priceAfterDiscount", afterDiscount > 0 ? afterDiscount : 0);
  }, [price, discount, form]);

  return (
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
            {/* image cover  */}
            <FormField
              control={form.control}
              name="imageCover"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="after:content-['*'] after:text-red-600">
                    {t("product-cover")}
                  </FormLabel>
                  <FormControl>
                    <InputImage
                      id="image-cover"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Gallery images  */}
            <FormField
              control={form.control}
              name="gallery"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="after:content-['*'] after:text-red-600">
                    {t("product-gallery")}{" "}
                  </FormLabel>
                  <FormControl>
                    <InputImage
                      id="gallery"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        field.onChange(files);
                      }}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("category-placeholder")} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("occasion-placeholder")} />
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
            {error && (
              <p className="text-red-500 text-center mt-2">{error.message} </p>
            )}
            <Button disabled={isPending} className="col-span-6 mt-20">
              {t("add-product")}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
