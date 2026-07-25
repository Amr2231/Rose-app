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
import { Image, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateCategorySchema,
  UpdateCategoryValues,
} from "@/lib/schemas/category.schema";
import { useUpdateCategory } from "../../../_hooks/use-update-category";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type Props = {
  id: string;
  defaultName: string;
};

export default function UpdateCategoryForm({ id, defaultName }: Props) {
  // Translation
  const t = useTranslations("dashboard.categories");
  // Navigation
  const router = useRouter();
  // Mutation
  const { mutate, isPending, isError, error } = useUpdateCategory();
  // Form & validation
  const form = useForm<UpdateCategoryValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: defaultName,
    },
    mode: "onChange",
  });
  // submit handler
  const onSubmit = (values: UpdateCategoryValues) => {
    mutate({
      id,
      name: values.name,
    });
  };

  return (
    <div>
      <h1 className="text-zinc-800 dark:text-zinc-100 capitalize text-2xl font-medium mb-4">
        {t("update")} : {defaultName}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full lg:w-175 min-h-80 justify-between"
        >
          <div className="flex flex-col gap-4">
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
                      placeholder="Enter category name"
                      error={!!form.formState.errors.name}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-start text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-300 ">
              <span className="flex gap-1.5 justify-center items-center">
                <Image size={18} />
                {t("viewImage")}
              </span>
            </div>
          </div>

          {isError && (
            <p className="text-maroon-500 text-md mt-4 m-auto text-center">
              {error?.message || "Error updating category"}
            </p>
          )}

          <Button disabled={isPending} type="submit" className="mt-6">
            {isPending ? (
              <Loader className="animate-spin mr-2" size={16} />
            ) : (
              t("update")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
