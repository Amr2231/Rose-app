import z from "zod";
import { Translations } from "../types/global";

export const UpdateProfileSchema = (t: Translations) =>
  z.object({
    firstName: z
      .string()
      .nonempty({ message: t("register.validation.firstName.required") })
      .min(3, t("register.validation.firstName.min"))
      .max(15, t("register.validation.firstName.max")),

    lastName: z
      .string()
      .nonempty({ message: t("register.validation.lastName.required") })
      .min(3, t("register.validation.lastName.min"))
      .max(15, t("register.validation.lastName.max")),
    email: z
      .email({
        error: (iss) =>
          iss.code === "invalid_type"
            ? `${t("non-email-error")}`
            : `${t("email-not-valid")}`,
      })
      .nonempty(`${t("required-email")}`),
    phone: z
      .string()
      .regex(/^\+201[0125][0-9]{8}$/, t("register.validation.phone.pattern"))
      .length(13, t("register.validation.phone.length")),
  });

export const ChangePasswordBaseSchema = (t: Translations) =>
  z.object({
    password: z
      .string()
      .nonempty({ message: t("register.validation.password.required") })
      .min(8, t("register.validation.password.min"))
      .regex(/[0-9]/, t("register.validation.password.number"))
      .regex(/[a-z]/, t("register.validation.password.lowercase"))
      .regex(/[A-Z]/, t("register.validation.password.uppercase"))
      .regex(/[#!?@$%^&*-]/, t("register.validation.password.special")),

    newPassword: z
      .string()
      .nonempty({ message: t("register.validation.password.required") })
      .min(8, t("register.validation.password.min"))
      .regex(/[0-9]/, t("register.validation.password.number"))
      .regex(/[a-z]/, t("register.validation.password.lowercase"))
      .regex(/[A-Z]/, t("register.validation.password.uppercase"))
      .regex(/[#!?@$%^&*-]/, t("register.validation.password.special")),

    confirmNewPassword: z
      .string()
      .nonempty({ message: t("register.validation.password.required") })
      .min(8, t("register.validation.password.min"))
      .regex(/[0-9]/, t("register.validation.password.number"))
      .regex(/[a-z]/, t("register.validation.password.lowercase"))
      .regex(/[A-Z]/, t("register.validation.password.uppercase"))
      .regex(/[#!?@$%^&*-]/, t("register.validation.password.special")),
  });
// .refine((data) => data.newPassword === data.confirmNewPassword, {
//   message: "Passwords do not match",
//   path: ["confirmNewPassword"],
// });

export const ChangePasswordSchema = (t: Translations) =>
  ChangePasswordBaseSchema(t).refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    }
  );

export const ChangePasswordBackendSchema = (t: Translations) =>
  ChangePasswordBaseSchema(t).omit({
    confirmNewPassword: true,
  });
