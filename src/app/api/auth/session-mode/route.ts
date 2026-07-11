import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// How long a "remembered" session should persist (30 days)
const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60;

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export async function POST(req: Request) {
  const { rememberMe } = await req.json();

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  // If there's no session cookie, signIn() didn't succeed - nothing to do here.
  if (!sessionCookie) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  // Re-set the SAME cookie value, only changing how long it lives:
  // - rememberMe = true  -> persistent cookie (survives browser restarts)
  // - rememberMe = false -> a real browser "session" cookie (no maxAge/expires),
  //   so it gets wiped automatically when the browser is closed.
  response.cookies.set({
    name: COOKIE_NAME,
    value: sessionCookie.value,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    ...(rememberMe ? { maxAge: REMEMBER_ME_MAX_AGE } : {}),
  });

  return response;
}
