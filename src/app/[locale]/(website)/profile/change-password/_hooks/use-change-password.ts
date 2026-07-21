"use client";
import { useToast } from "@/hooks/use-toast";
import { ChangePasswordPayload } from "@/lib/types/account";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useGetUser } from "../../_hooks/use-get-user";
import { changePasswordAction } from "@/lib/actions/account.actions";

export function useChangePassword() {
  const { toast } = useToast();
  const { user } = useGetUser();
  const { mutate, isPending } = useMutation({
    mutationFn: async (field: ChangePasswordPayload) =>
      await changePasswordAction(field),
    onSuccess: async (data, fields) => {
      toast({
        title: "Password Changed successfully",
        variant: "success",
      });

      if (data.token) {
        await signIn("credentials", {
          email: user?.user.email,
          password: fields.newPassword,
          redirect: false,
        });
      }
    },
    onError: () => {
      toast({
        title: "Failed to change password",
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending };
}
