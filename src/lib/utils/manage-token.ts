import { decode, JWT } from "next-auth/jwt";
import { cookies } from "next/headers";

const cookieName =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
export async function getToken() {
  const tokenCookie = (await cookies()).get(cookieName)?.value;
  if (!tokenCookie) return null;

  try {
    const jwt = await decode({
      token: tokenCookie,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return jwt;
  } catch (error) {
    return null;
  }
}

type MyJWT = JWT & { exp?: number }; // extend type to include exp

export async function isLogged(): Promise<boolean> {
  const jwt = (await getToken()) as MyJWT | null;

  if (!jwt) return false;

  // Check expiration if exp exists
  const now = Math.floor(Date.now() / 1000);
  if (jwt.exp && jwt.exp < now) {
    return false; // token expired
  }

  return true; // token exists and not expired
}
