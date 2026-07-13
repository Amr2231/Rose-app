"use client";

import { useMutation } from "@tanstack/react-query";
import { registerAction } from "../_actions/register.actions";
import { useRouter } from "next/navigation";
import { RegisterPayload } from "@/lib/types/auth";

export function useRegister() {
  // Navigation
  const router = useRouter();

  // Mutations
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (values: RegisterPayload) => {
      const response = await registerAction(values);

      if (response.error) {
        throw new Error(response.error || "Sign up failed");
      }
      router.push("/login");
      return response;
    },
  });

  return { isPending, error, signup: mutate };
}
