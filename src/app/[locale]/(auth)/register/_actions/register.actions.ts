"use server";

import { getServerApiBase, parseApiEnvelope } from "@/lib/utils/api-response";
import {
  AuthResult,
  ConfirmEmailVerificationField,
  RegisterPayload,
  SendEmailVerificationField,
} from "@/lib/types/auth";

// send-email-verification
export async function sendEmailVerificationAction(
  fields: SendEmailVerificationField,
) {
  const response = await fetch(
    `${getServerApiBase()}/api/auth/send-email-verification`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    },
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

// confirm-email-verification
export async function confirmEmailVerificationAction(
  fields: ConfirmEmailVerificationField,
) {
  const response = await fetch(
    `${getServerApiBase()}/api/auth/confirm-email-verification`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    },
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

// register email must be verified first
export async function registerAction(values: RegisterPayload) {
  const response = await fetch(`${getServerApiBase()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  try {
    const payload = await parseApiEnvelope<AuthResult>(response);
    return { ...payload, error: null as string | null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Sign up failed" };
  }
}
