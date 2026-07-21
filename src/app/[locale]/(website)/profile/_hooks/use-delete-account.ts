import { useToast } from "@/hooks/use-toast";
import { deleteAccountAction } from "@/lib/actions/account.actions";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function useDeleteAccount() {
  const t = useTranslations();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => await deleteAccountAction(),
    onSuccess: () => {
      toast({
        title: t("your-account-deleted"),
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: t("account-delete-failed"),
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending };
}
