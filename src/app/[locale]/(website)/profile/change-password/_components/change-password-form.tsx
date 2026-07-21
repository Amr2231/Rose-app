"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ChangePasswordBackendSchema,
  ChangePasswordSchema,
} from "@/lib/schemas/account.schema";
import { ChangePasswordField } from "@/lib/types/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useChangePassword } from "../_hooks/use-change-password";
import { PasswordInput } from "@/components/ui/password-input";

export default function ChangePasswordForm() {
  // Translations
  const t = useTranslations();

  //Mutations
  const { mutate, isPending } = useChangePassword();
  //Form
  const form = useForm<ChangePasswordField>({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema(t)),
  });

  // Functions
  const onSubmit: SubmitHandler<ChangePasswordField> = (values) => {
    const payload = ChangePasswordBackendSchema(t).parse(values);
    mutate(payload, {
      onSuccess: () => form.reset(),
    });
  };
  return (
    <div className="w-full max-w-236 h-auto lg:h-144 dark:text-zinc-50 text-zinc-800 dark:text-zinc-100 ">
      {/* Form  */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" pb-9 space-y-2.5"
        >
          <div className="border-b pb-6 mb-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("old-password-label")}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="***********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("new-password-label")}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="***********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirm-new-password-label")}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="***********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pt-10 sm:pt-20 ">
            <Button
              isLoading={isPending}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              type="submit"
              className="py-3.5 px-4 w-full sm:w-60 sm:ms-auto  "
            >
              {t("change-password")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
