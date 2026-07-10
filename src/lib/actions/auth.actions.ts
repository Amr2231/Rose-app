"use server";

import { getServerApiBase, parseApiEnvelope } from "../utils/api-response";
import {
  ForgotPasswordField,
  ForgotPasswordResult,
  ResetPasswordPayload,
} from "../types/auth";

// ---------------------------------------------------------------------------
// Forgot Password - POST /api/auth/forgot-password
// Sends an email with a reset link that points back to `redirectUrl` with a
// `?token=...` query param. See app/[locale]/(auth)/reset-password/page.tsx
// ---------------------------------------------------------------------------
export async function forgotPasswordAction(fields: ForgotPasswordField) {
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/reset-password`;

  const response = await fetch(
    `${getServerApiBase()}/api/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: fields.email, redirectUrl }),
    }
  );

  try {
    const payload = await parseApiEnvelope<ForgotPasswordResult>(response);
    return { ...payload, error: null as string | null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

// ---------------------------------------------------------------------------
// Reset Password - POST /api/auth/reset-password
// Called from the reset-password page using the `token` from the email link.
// ---------------------------------------------------------------------------
export async function resetPasswordAction(fields: ResetPasswordPayload) {
  const response = await fetch(
    `${getServerApiBase()}/api/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    }
  );

  try {
    const payload = await parseApiEnvelope<{ message?: string }>(response);
    return { ...payload, error: null as string | null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
