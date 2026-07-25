"use client";

import { FileInputButton } from "@/components/ui/file-input";
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
  AddOccasionSchema,
  AddOccasionSchemaType,
} from "@/lib/schemas/occasions.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useAddOccasion } from "../_hooks/use-add-occasion";
import { Asterisk } from "lucide-react";

export default function AddOccasionForm() {
  // Translations
  const t = useTranslations();

  // Mutations
  const { mutate, isPending, error } = useAddOccasion();

  //Form
  const form = useForm<AddOccasionSchemaType>({
    defaultValues: {
      name: "",
      image: undefined,
    },
    resolver: zodResolver(AddOccasionSchema(t)),
  });

  // Functions
  const onSubmit: SubmitHandler<AddOccasionSchemaType> = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.image) {
      formData.append("image", values.image);
    }
    mutate(formData, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:max-w-[47rem] pt-6 pb-9 mt-12 lg:ms-6 "
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
                <Input
                  placeholder={t("occasion-name-placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex">
                {t("image")}{" "}
                {field.value === undefined && (
                  <Asterisk size={12} className="text-red-600" />
                )}
              </FormLabel>
              <FormControl>
                <FileInputButton
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                  error={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-600 text-sm mt-2">{error.message}</p>}

        <Button
          isLoading={isPending}
          disabled={!form.formState.isValid && form.formState.isSubmitting}
          type="submit"
          className="w-full mt-28 "
        >
          {t("add-occasion")}
        </Button>
      </form>
    </FormProvider>
  );
}
