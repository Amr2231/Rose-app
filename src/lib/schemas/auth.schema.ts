// auth.schema.ts
import z from "zod";
import { Translations } from "../types/global";

// ---------------------------------------------------------------------------
// Login - new backend authenticates with USERNAME, not email
// ---------------------------------------------------------------------------
export const LoginSchema = (t: Translations) =>
  z.object({
    username: z
      .string()
      .nonempty(t("schema.username-required"))
      .min(3, t("schema.username-min")),
    password: z.string().nonempty(t("schema.password-required")),
    rememberMe: z.boolean().optional(),
  });

export type loginValues = z.infer<ReturnType<typeof LoginSchema>>;
/** @deprecated use LoginSchema */
export const loginSchema = LoginSchema;

// ---------------------------------------------------------------------------
// Register - step 1: email (kicks off send-email-verification)
// ---------------------------------------------------------------------------
export const RegisterEmailSchema = (t: Translations) =>
  z.object({
    email: z.string().email(t("validation.email.invalid")).nonempty(t("validation.email.invalid")),
  });

// ---------------------------------------------------------------------------
// Register - step 2: 6-digit OTP (confirm-email-verification)
// ---------------------------------------------------------------------------
export const otpSchema = z.object({
  otp: z.string(),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// ---------------------------------------------------------------------------
// Register - step 3: account details (final /api/auth/register call)
// ---------------------------------------------------------------------------
export const RegisterDetailsSchema = (t: Translations) =>
  z
    .object({
      username: z
        .string()
        .nonempty(t("validation.username.required"))
        .min(3, t("validation.username.min"))
        .max(20, t("validation.username.max"))
        .regex(/^[a-zA-Z0-9_]+$/, t("validation.username.pattern")),

      firstName: z
        .string()
        .nonempty({ message: t("validation.firstName.required") })
        .regex(/^[a-zA-Z]+$/, t("validation.firstName.pattern"))
        .min(3, t("validation.firstName.min"))
        .max(15, t("validation.firstName.max")),

      lastName: z
        .string()
        .nonempty({ message: t("validation.lastName.required") })
        .regex(/^[a-zA-Z]+$/, t("validation.lastName.pattern"))
        .min(3, t("validation.lastName.min"))
        .max(15, t("validation.lastName.max")),

      gender: z.enum(["MALE", "FEMALE"] as const, {
        error: t("validation.gender.required"),
      }),

      password: z
        .string()
        .nonempty({ message: t("validation.password.required") })
        .min(8, t("validation.password.min"))
        .regex(/[0-9]/, t("validation.password.number"))
        .regex(/[a-z]/, t("validation.password.lowercase"))
        .regex(/[A-Z]/, t("validation.password.uppercase"))
        .regex(/[#!?@$%^&*-]/, t("validation.password.special")),

      confirmPassword: z
        .string()
        .nonempty({ message: t("validation.rePassword.required") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation.rePassword.mismatch"),
    });

export type RegistrationSchemaType = z.infer<ReturnType<typeof RegisterDetailsSchema>>;

// ---------------------------------------------------------------------------
// Forgot password - step 1: email (POST /api/auth/forgot-password)
// ---------------------------------------------------------------------------
export const ForgotPasswordSchema = (t: Translations) =>
  z.object({
    email: z
      .email({
        error: (iss) =>
          iss.code === "invalid_type"
            ? `${t("non-email-error")}`
            : `${t("email-not-valid")}`,
      })
      .nonempty(`${t("required-email")}`),
  });

// ---------------------------------------------------------------------------
// Reset password - reached via the emailed link (?token=...)
// (POST /api/auth/reset-password)
// ---------------------------------------------------------------------------
export const ResetPasswordSchema = (t: Translations) =>
  z
    .object({
      newPassword: z
        .string()
        .nonempty(t("password-is-required"))
        .min(8, t("password-at-least-8-characters"))
        .regex(/[A-Z]/, t("password-contain-uppercase-letter"))
        .regex(/[a-z]/, t("password-contain-lowercase-letter"))
        .regex(/[0-9]/, t("password-contain--one-number"))
        .regex(
          /[@$!%*?&#^-]/,
          "Password must contain at least one special character"
        ),
      confirmPassword: z.string().nonempty(t("password-is-required")),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: t("passwords-do-not-match"),
      path: ["confirmPassword"],
    });

export type ResetPasswordFieldType = z.infer<ReturnType<typeof ResetPasswordSchema>>;
