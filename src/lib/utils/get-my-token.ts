"use server";
import { decode, JWT } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getMyToken(): Promise<JWT | null> {
  const allCookies = await cookies();
  const tokenValue =
    allCookies.get("next-auth.session-token")?.value ||
    allCookies.get("__Secure-next-auth.session-token")?.value;

  if (!tokenValue) return null;

  const decoded = await decode({
    token: tokenValue,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return decoded;
}
