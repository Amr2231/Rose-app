"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RegisterEmailSchema } from "@/lib/schemas/auth.schema";
import { useSendEmailVerification } from "../_hooks/use-send-email-verification";
import { z } from "zod";

// types
type RegisterEmailValues = z.infer<ReturnType<typeof RegisterEmailSchema>>;

// props
type EmailStepProps = {
  defaultEmail?: string;
  onSuccess: (email: string) => void;
};

export default function EmailStep({ defaultEmail, onSuccess }: EmailStepProps) {
  // Translations
  const t = useTranslations("register");
  const { isPending, error, sendEmailVerification } =
    useSendEmailVerification();

  // default value for email
  const form = useForm<RegisterEmailValues>({
    defaultValues: { email: defaultEmail ?? "" },
    resolver: zodResolver(RegisterEmailSchema(t)),
  });

  // onSubmit handler
  const onSubmit: SubmitHandler<RegisterEmailValues> = (values) => {
    sendEmailVerification(values, {
      onSuccess: () => onSuccess(values.email),
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[25.5rem] lg:max-w-[30rem]">
        <div className="mb-10">
          {/* Heading */}
          <h3 className="font-edwardian text-4xl text-maroon-700 text-center dark:text-softPink-300">
            {t("heading")}
          </h3>
        </div>

        {/* Form  */}
        <div className="border-t border-b border-zinc-300 dark:border-zinc-600 pt-3 pb-9">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-500 text-center mt-2">{error.message}</p>
              )}

              {/* Continue Button */}
              <Button
                isLoading={isPending}
                type="submit"
                className="mt-6 w-full"
              >
                {t("continue")}
              </Button>
            </form>
          </Form>
        </div>

        {/* Already have an account? */}
        <p className="text-center text-sm mt-9 dark:text-white">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="text-maroon-700 hover:underline dark:text-softPink-300"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
