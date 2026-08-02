import { NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";

// NOTE: this route isn't called from anywhere in the app - actual login goes
// through NextAuth's Credentials provider in `src/auth.ts`, which already
// calls the correct `/api/auth/login` endpoint with `username`. Fixed here
// too (was `/auth/signin` with `email`, matching the OLD backend) so this
// doesn't become a landmine if something starts using it.
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${getServerApiBase()}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: body.username,
      password: body.password,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    return NextResponse.json(
      { message: data?.message || "Login failed" },
      { status: res.status }
    );
  }

  return NextResponse.json({
    token: data?.payload?.token,
    user: data?.payload?.user,
  });
}
