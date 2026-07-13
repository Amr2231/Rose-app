"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { LoginSchema, loginValues } from "@/lib/schemas/auth.schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useLogin from "../_hooks/use-login";
import { Loader } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getFriendlyErrorMessage } from "@/lib/utils/auth";
import { Link } from "@/i18n/navigation";

export default function LoginForm() {
  // translation
  const t = useTranslations("login");
  const locale = useLocale();
  const tKey = (key: string) => {
    if (locale === "ar") {
      const map: Record<string, string> = {
        rememberMe: "remember-me",
        loginBtn: "login-btn",
        forgotPassword: "forgot-password",
        usernamePlaceholder: "username-placeholder",
        passwordPlaceholder: "password-placeholder",
      };
      return t(map[key] || key);
    }
    return t(key);
  };

  // default values
  const form = useForm<loginValues>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    resolver: zodResolver(LoginSchema(t)),
    mode: "onChange",
  });

  // Mutations
  const { isPending, mutate: login, isError, error } = useLogin();
  const router = useRouter();

  const errorMessage = getFriendlyErrorMessage(error?.message || "", t);

  const onsubmit: SubmitHandler<loginValues> = async (values) => {
    login(values, {
      onSuccess: () => {
        router.replace("/");
        router.refresh();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full max-w-[25rem] lg:max-w-[30rem]"
        onSubmit={form.handleSubmit(onsubmit)}
      >
        {/* Fields */}
        <div className="flex flex-col gap-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("username")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={tKey("usernamePlaceholder")}
                    error={!!form.formState.errors.username}
                  />
                </FormControl>
                <FormMessage className="text-[0.9rem]" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder={tKey("passwordPlaceholder")}
                    error={!!form.formState.errors.password}
                  />
                </FormControl>
                <FormMessage className="text-[0.9rem]" />
              </FormItem>
            )}
          />

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-maroon-700 dark:text-softPink-300 font-medium mt-2"
            >
              {tKey("forgotPassword")}
            </Link>
          </div>
        </div>

        {/* Error */}
        {isError && (
          <p className="text-center text-red-600 mt-3">{errorMessage}</p>
        )}

        {/* Remember Me */}
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <Label className="flex items-center gap-2 cursor-pointer my-5 mb-8">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-maroon-700 data-[state=checked]:bg-maroon-600"
              />
              <span className="text-zinc-700 dark:text-zinc-300">
                {tKey("rememberMe")}
              </span>
            </Label>
          )}
        />

        {/* Submit */}
        <Button disabled={isPending} type="submit">
          {isPending ? (
            <Loader className="animate-spin mr-2" size={16} />
          ) : (
            tKey("loginBtn")
          )}
        </Button>
      </form>
    </Form>
  );
}
