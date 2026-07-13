"use client";

import { useMutation } from "@tanstack/react-query";
import { confirmEmailVerificationAction } from "../_actions/register.actions";
import { ConfirmEmailVerificationField } from "@/lib/types/auth";

export function useConfirmEmailVerification() {
  // Mutations
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (fields: ConfirmEmailVerificationField) => {
      const response = await confirmEmailVerificationAction(fields);

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    },
  });

  return { isPending, error, confirmEmailVerification: mutate };
}
