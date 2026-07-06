import { FORGOT_PASSWORD_STEPS, REGISTER_STEPS } from "../constants/auth.constant";
import z from "zod";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  LoginSchema,
  RegisterEmailSchema,
  RegisterDetailsSchema,
  otpSchema,
} from "../schemas/auth.schema";
import { User } from "./user";

export type ForgotPasswordSteps =
  (typeof FORGOT_PASSWORD_STEPS)[keyof typeof FORGOT_PASSWORD_STEPS];

export type RegisterSteps = (typeof REGISTER_STEPS)[keyof typeof REGISTER_STEPS];

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone?: string;
    photo?: string;
    role: "USER" | "ADMIN";
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    accesstoken: string;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      phone?: string;
      photo?: string;
      role: "USER" | "ADMIN";
      emailVerified: boolean;
      phoneVerified: boolean;
      createdAt: string;
      accesstoken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string | null;
    phone?: string;
    role: "USER" | "ADMIN";
    photo?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    accesstoken: string;
  }
}

// ---- Login ----
export type LoginValues = z.infer<ReturnType<typeof LoginSchema>>;

// ---- Register ----
export type RegisterEmailField = z.infer<ReturnType<typeof RegisterEmailSchema>>;
export type RegisterDetailsField = z.infer<ReturnType<typeof RegisterDetailsSchema>>;

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
};

export type AuthResult = {
  user: User;
  token: string;
};

// ---- Email verification (used by register flow) ----
export type SendEmailVerificationField = { email: string };
export type ConfirmEmailVerificationField = { email: string; code: string };
export type OtpFormValues = z.infer<typeof otpSchema>;

// ---- Forgot / reset password ----
export type ForgotPasswordField = z.infer<ReturnType<typeof ForgotPasswordSchema>>;
export type ForgotPasswordResult = { message?: string; token?: string };

export type ResetPasswordField = z.infer<ReturnType<typeof ResetPasswordSchema>>;
export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};
