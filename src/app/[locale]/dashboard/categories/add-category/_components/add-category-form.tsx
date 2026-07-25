"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  CreateCategoryValues,
} from "@/lib/schemas/category.schema";
import { useCreateCategory } from "../../../_hooks/use-create-category";
import { FileInput } from "@/components/ui/file-input";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function AddCategoryForm() {
  // Translation
  const t = useTranslations("dashboard.categories");
  // Navigation
  const router = useRouter();
  // Mutation
  const { mutate, isPending, isError, error } = useCreateCategory();
  // Form & validation
  const form = useForm<CreateCategoryValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
    mode: "onChange",
  });
  // submit handler
  const onSubmit = (values: CreateCategoryValues) => {
    mutate({
      name: values.name,
      image: values.image[0],
    });
  };

  return (
    <div>
      <h1 className="text-zinc-800 dark:text-zinc-100 text-xl font-bold mb-4">{t("add")}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full lg:w-175 min-h-80 justify-between"
        >
          <div className="flex flex-col gap-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("nameLabel")}{" "}
                    <span className="text-red-600 text-lg">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("namePlaceholder")}
                      error={!!form.formState.errors.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("imageLabel")}{" "}
                    <span className="text-red-600 text-lg">*</span>
                  </FormLabel>
                  <FormControl>
                    <FileInput
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.image}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* // Server Error Message */}
          {isError && (
            <p className="text-maroon-500 text-md mt-4 m-auto text-center">
              {error?.message || "Error creating category"}
            </p>
          )}

          {/* Submit Button */}
          <Button disabled={isPending} type="submit" className="mt-6">
            {isPending ? (
              <Loader className="animate-spin mr-2" size={16} />
            ) : (
              t("submitButton")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
