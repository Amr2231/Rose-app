import { loginValues } from "@/lib/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { signIn, getSession } from "next-auth/react";

export default function useLogin() {
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

      // IMPORTANT: use getSession(), not useSession().update(). update()
      // silently no-ops when there's no existing client-side session yet
      // (going from logged-out to logged-in right here) - it's meant to
      // refresh an *existing* session, not fetch one for the first time.
      // getSession() does a real fetch and broadcasts the result to every
      // useSession() consumer regardless of prior state.
      await getSession();

      return payload;
    },
  });
}
