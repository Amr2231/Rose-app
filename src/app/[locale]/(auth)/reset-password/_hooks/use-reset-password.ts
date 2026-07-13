"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/navigation";
import { resetPasswordAction } from "@/lib/actions/auth.actions";
import { ResetPasswordPayload } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";

export default function useResetPassword() {
  const router = useRouter();
  const { toast } = useToast();

  const { isPending, error, mutate } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (fields: ResetPasswordPayload) => {
      const payload = await resetPasswordAction(fields);

      if (payload.error) {
        throw new Error(payload.error);
      }

      return payload;
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      });
      router.push("/login");
    },
  });

  return { isPending, error, resetPassword: mutate };
}
