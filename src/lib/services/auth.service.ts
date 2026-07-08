import { getClientApiBase, parseApiEnvelope } from "../utils/api-response";
import {
  AuthResult,
  ConfirmEmailVerificationField,
  ForgotPasswordResult,
  RegisterPayload,
  ResetPasswordPayload,
  SendEmailVerificationField,
} from "../types/auth";

/**
 * Client-side auth API calls (safe to call from hooks / "use client" code).
 * Every call hits the new backend and unwraps the `{status, code, message,
 * payload}` envelope via `parseApiEnvelope`.
 */

function apiUrl(path: string) {
  return `${getClientApiBase()}${path}`;
}

// ---- Step 1: send OTP to email (before registration) ----
export async function sendEmailVerification(fields: SendEmailVerificationField) {
  const res = await fetch(apiUrl("/api/auth/send-email-verification"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  return parseApiEnvelope<{ message?: string }>(res);
}

// ---- Step 2: confirm OTP ----
export async function confirmEmailVerification(
  fields: ConfirmEmailVerificationField
) {
  const res = await fetch(apiUrl("/api/auth/confirm-email-verification"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  return parseApiEnvelope<{ message?: string }>(res);
}

// ---- Step 3: register (email must already be verified) ----
export async function registerRequest(payload: RegisterPayload) {
  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiEnvelope<AuthResult>(res);
}

// ---- Login ----
export async function loginRequest(payload: { username: string; password: string }) {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiEnvelope<AuthResult>(res);
}

// ---- Forgot password (sends email with reset link/code) ----
export async function forgotPasswordRequest(payload: {
  email: string;
  redirectUrl: string;
}) {
  const res = await fetch(apiUrl("/api/auth/forgot-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiEnvelope<ForgotPasswordResult>(res);
}

// ---- Reset password using the token from the emailed link ----
export async function resetPasswordRequest(payload: ResetPasswordPayload) {
  const res = await fetch(apiUrl("/api/auth/reset-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiEnvelope<{ message?: string }>(res);
}
