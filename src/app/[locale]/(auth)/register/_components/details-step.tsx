"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { useRegister } from "../_hooks/use-register";
import { useTranslations } from "next-intl";
import {
  RegisterDetailsSchema,
  RegistrationSchemaType,
} from "@/lib/schemas/auth.schema";

// props
type DetailsStepProps = {
  email: string;
};

export default function DetailsStep({ email }: DetailsStepProps) {
  // Translations
  const t = useTranslations("register");

  // Mutations
  const { isPending, error, signup } = useRegister();

  // default values
  const form = useForm<RegistrationSchemaType>({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      gender: undefined,
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(RegisterDetailsSchema(t)),
  });

  // onSubmit handler
  const onSubmit = (values: RegistrationSchemaType) => {
    signup({ ...values, email });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        {/* Heading */}
        <div className="mb-10">
          <h3 className="font-edwardian text-4xl text-maroon-700 text-center dark:text-softPink-300">
            {t("heading")}
          </h3>
        </div>

        {/* Form */}
        <div className="border-t border-b border-zinc-300 dark:border-zinc-600 pt-3 pb-9">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.username")}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="fadyrefaat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {/* first name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.firstName")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Fady" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.lastName")}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Refaat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.gender.gender")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">
                          {t("fields.gender.male")}
                        </SelectItem>
                        <SelectItem value="FEMALE">
                          {t("fields.gender.female")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.password")}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="*********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.confirmPassword")}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="*********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-500 text-center mt-2">{error.message}</p>
              )}

              {/* Create account */}
              <Button
                isLoading={isPending}
                type="submit"
                className="mt-6 w-full"
              >
                {t("fields.createAccount")}
              </Button>
            </form>
          </Form>
        </div>
        {/* Login button */}
        <p className="text-center text-sm mt-9 dark:text-white">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href={"/login"}
            className="text-maroon-700 hover:underline dark:text-softPink-300"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
