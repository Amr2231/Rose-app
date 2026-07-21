"use client";

import { ReactNode } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { UpdateProfileField } from "@/lib/types/account";
import { UpdateProfileSchema } from "@/lib/schemas/account.schema";
import { useGetUser } from "../_hooks/use-get-user";
import { useEffect } from "react";
import { useUpdateProfile } from "../_hooks/use-update-profile";
import DeleteDialog from "./delete-dialog";
import ProfileImage from "./profile-image";

interface AccountFormProps {
  extraActions?: ReactNode;
  onChangePassword?: () => void;
}

export default function AccountForm({
  extraActions,
  onChangePassword,
}: AccountFormProps = {}) {
  // Translations
  const t = useTranslations();
  //Queries
  const { user } = useGetUser();
  // Mutations
  const { isPending, mutate } = useUpdateProfile();
  //Form
  const form = useForm<UpdateProfileField>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    resolver: zodResolver(UpdateProfileSchema(t)),
  });
  // Functions
  const onSubmit: SubmitHandler<UpdateProfileField> = (values) => {
    mutate(values);
  };
  // Effects
  useEffect(() => {
    if (user?.user) {
      form.reset({
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        email: user.user.email,
        phone: user.user.phone,
      });
    }
  }, [user, form]);
  return (
    <div className="w-full max-w-[59rem] h-auto lg:h-[36rem] dark:text-zinc-50 text-zinc-800 dark:text-zinc-100 ">
      {/* Heading */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Image */}
          <ProfileImage userPhoto={user?.user?.photo} />
        </div>
        <p className="flex flex-col gap-4 ">
          <span className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 ps-1">
            {t("upload-photo")}
          </span>
          <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">
            {t("photo-extentions")}
          </span>
        </p>
      </div>
      {/* Form  */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" pt-6 pb-9 space-y-2.5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("register.fields.firstName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("register.fields.lastName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email-label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("email-placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Phone number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.fields.phone")}</FormLabel>
                <FormControl>
                  <PhoneInput
                    className="w-full"
                    placeholder="01012345678"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Gender */}
          <Field className="text-zinc-400 dark:text-zinc-500">
            <FieldLabel>{t("gender")}</FieldLabel>
            <Select>
              <SelectTrigger className="w-full text-zinc-400 dark:text-zinc-500" disabled={true}>
                <SelectValue placeholder={t("male")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="male">{t("male")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-10 sm:pt-20 ">
            <div className="flex items-center gap-4">
              <DeleteDialog />

              {/* button change password */}
              <Button
                type="button"
                variant={"ghost"}
                onClick={onChangePassword}
              >
                {t("change-password")}
              </Button>
            </div>
            <Button
              isLoading={isPending}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              type="submit"
              className="py-3.5 px-4 w-full sm:w-60  "
            >
              {t("save-changes")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
