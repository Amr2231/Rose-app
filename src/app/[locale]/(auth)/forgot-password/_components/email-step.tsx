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
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ForgotPasswordSchema } from "@/lib/schemas/auth.schema";
import useForgotPassword from "../_hooks/use-forgot-password";
import { ForgotPasswordField } from "@/lib/types/auth";

type EmailStepProps = {
  /** Called once the reset email has been sent successfully */
  onSuccess?: (email: string) => void;
};

export default function EmailStep({ onSuccess }: EmailStepProps) {
  // Translations
  const t = useTranslations();

  // Mutations
  const { isPending, error, forgotPassword } = useForgotPassword();

  //Form
  const form = useForm<ForgotPasswordField>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ForgotPasswordSchema(t)),
  });

  // Functions
  const onSubmit: SubmitHandler<ForgotPasswordField> = (values) => {
    forgotPassword(values, {
      onSuccess: () => onSuccess?.(values.email),
    });
  };
  return (
    <div className="w-full max-w-[25.5rem] lg:max-w-[30rem] dark:text-zinc-50 text-zinc-800">
      {/* Heading */}
      <h2 className="text-2xl font-semibold">{t("forgot-password-heading")}</h2>
      <p className="mb-4 font-medium text-base">{t("forget-password-text")}</p>

      {/* Form  */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-y border-y-zinc-200 dark:border-y-zinc-600 pt-6 pb-9 space-y-7"
        >
          {/* Email field */}
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

          {error && (
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          )}

          {/* Submit button */}
          <Button
            isLoading={isPending}
            disabled={!form.formState.isValid && form.formState.isSubmitting}
            type="submit"
            className="w-full "
          >
            {t("continue")}
          </Button>
        </form>

        {/* register button */}
        <p className="text-center mt-5 font-medium">
          {t.rich("dont-have-an-account", {
            a: (chunk) => (
              <Link
                href="/register"
                className="text-maroon-700 font-bold dark:text-softPink-200"
              >
                {chunk}
              </Link>
            ),
          })}
        </p>
      </FormProvider>
    </div>
  );
}
