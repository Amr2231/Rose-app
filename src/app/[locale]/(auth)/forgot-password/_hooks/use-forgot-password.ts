import { useToast } from "@/hooks/use-toast";
import { forgotPasswordAction } from "@/lib/actions/auth.actions";
import { ForgotPasswordField } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";

export default function useForgotPassword() {
  // toast
  const { toast } = useToast();

  // Mutations
  const { isPending, error, mutate, data } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (fields: ForgotPasswordField) => {
      const payload = await forgotPasswordAction(fields);

      if (payload.error) {
        throw new Error(payload.error);
      }

      return payload;
    },
    onSuccess: () => {
      toast({
        title: "Email sent",
        description: "Check your inbox for the password reset link.",
      });
    },
  });

  return { isPending, error, forgotPassword: mutate, data };
}
