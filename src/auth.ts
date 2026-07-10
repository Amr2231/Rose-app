import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerApiBase, parseApiEnvelope } from "./lib/utils/api-response";
import { AuthResult } from "./lib/types/auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },

      authorize: async (credentials) => {
        const response = await fetch(`${getServerApiBase()}/api/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const { user, token } = await parseApiEnvelope<AuthResult>(response);

        return {
          ...user,
          id: user.id,
          accesstoken: token,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const authenticatedUser = user as unknown as {
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
        token = { ...token, ...authenticatedUser };
      }

      if (trigger === "update" && session?.user) {
        token = {
          ...token,
          ...session.user,
        };
      }

      return token;
    },

    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.username = token.username;
      session.user.email = token.email || "";
      session.user.phone = token.phone;
      session.user.role = token.role;
      session.user.emailVerified = token.emailVerified;
      session.user.phoneVerified = token.phoneVerified;
      session.user.createdAt = token.createdAt;
      session.user.accesstoken = token.accesstoken;
      session.user.photo = token.photo;
      return session;
    },
  },
};
