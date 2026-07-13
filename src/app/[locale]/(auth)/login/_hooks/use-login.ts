import { loginValues } from "@/lib/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

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

      return payload;
    },
  });
}
