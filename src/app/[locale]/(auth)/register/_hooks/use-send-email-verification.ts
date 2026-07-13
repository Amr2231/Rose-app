"use client";

import { useMutation } from "@tanstack/react-query";
import { sendEmailVerificationAction } from "../_actions/register.actions";
import { SendEmailVerificationField } from "@/lib/types/auth";

export function useSendEmailVerification() {
  // Mutations
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (fields: SendEmailVerificationField) => {
      const response = await sendEmailVerificationAction(fields);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
  });

  return { isPending, error, sendEmailVerification: mutate };
}
