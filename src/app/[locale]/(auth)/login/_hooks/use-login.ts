import { loginValues } from "@/lib/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";

export default function useLogin() {
  // signIn() already syncs the client-side session, but the follow-up
  // session-mode request below rewrites the cookie again afterwards - so
  // components reading useSession() (e.g. the header) could still show the
  // pre-login state until something (a manual refresh) triggers a refetch.
  // Explicitly calling update() after both requests finish forces an
  // immediate resync instead of waiting on that.
  const { update } = useSession();

  // Mutations
  return useMutation({
    mutationFn: async (values: loginValues) => {
      const payload = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (payload?.error) {
        throw new Error(payload.error);
      }

      // Apply session mode after successful login
      try {
        await fetch("/api/auth/session-mode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rememberMe: values.rememberMe }),
        });
      } catch (err) {
        console.error("Failed to apply session-mode:", err);
      }

      await update();

      return payload;
    },
  });
}
