"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  UpdateOccasionSchema,
  UpdateOccasionSchemaType,
} from "@/lib/schemas/occasions.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Asterisk, Image } from "lucide-react";
import { Occasion } from "@/lib/types/occasion";
import { useUpdateOccasion } from "../_hooks/use-update-occasion";

type UpdateOccasionFormProps = {
  occasion: Occasion;
};

export default function UpdateOccasionForm({
  occasion,
}: UpdateOccasionFormProps) {
  // Translations
  const t = useTranslations();
  // Mutations
  const { mutate, isPending, error } = useUpdateOccasion();
  //Form
  const form = useForm<UpdateOccasionSchemaType>({
    defaultValues: {
      name: occasion.name,
    },
    resolver: zodResolver(UpdateOccasionSchema(t)),
  });

  // Functions
  const onSubmit: SubmitHandler<UpdateOccasionSchemaType> = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);

    mutate(
      { occasionId: occasion._id, formData },
      {
        onSuccess: () => form.reset(),
      }
    );
  };
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:max-w-[47rem] pt-6 pb-9 mt-2 lg:ms-6 "
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel className="flex">
                {t("name-lable")}{" "}
                {field.value === "" && (
                  <Asterisk size={12} className="text-red-600" />
                )}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("update-occasion")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-1.5 w-fit cursor-pointer text-blue-600 hover:text-blue-800 transition-colors text-sm">
          <Image size={18} /> View occasion image
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error.message}</p>}

        <Button
          isLoading={isPending}
          disabled={!form.formState.isValid && form.formState.isSubmitting}
          type="submit"
          className="w-full mt-28 "
        >
          {t("update-occasion")}
        </Button>
      </form>
    </FormProvider>
  );
}
