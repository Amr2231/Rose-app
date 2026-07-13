"use client";

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
import { ResetPasswordSchema, ResetPasswordFieldType } from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import useResetPassword from "../_hooks/use-reset-password";

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations();

  const { isPending, error, resetPassword } = useResetPassword();

  const form = useForm<ResetPasswordFieldType>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ResetPasswordSchema(t)),
  });

  const onSubmit: SubmitHandler<ResetPasswordFieldType> = (values) => {
    resetPassword({
      token,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
  };

  if (!token) {
    return (
      <div className="w-full max-w-[25.5rem] lg:max-w-[30rem] text-center dark:text-zinc-50 text-zinc-800">
        <h2 className="text-2xl font-semibold mb-2">{t("invalid-reset-link-title")}</h2>
        <p className="mb-6 font-medium text-base">{t("invalid-reset-link-text")}</p>
        <Link
          href="/forgot-password"
          className="text-maroon-700 font-bold dark:text-softPink-200"
        >
          {t("request-new-link")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[25.5rem] lg:max-w-[30rem] dark:text-zinc-50 text-zinc-800">
      <h2 className="text-2xl font-semibold">{t("create-new-password-label")}</h2>
      <p className="mb-4 font-medium text-base">{t("create-new-password-text")}</p>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-y border-y-zinc-200 dark:border-y-zinc-600 pt-6 pb-9 space-y-7"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password-label")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={"************"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirm-password-label")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={"************"} {...field} />
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
            className="w-full "
          >
            {t("reset-password-btn")}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
