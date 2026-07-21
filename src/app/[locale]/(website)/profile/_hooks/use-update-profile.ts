import { useToast } from "@/hooks/use-toast";
import { updateProfileAction } from "@/lib/actions/account.actions";
import { UpdateProfileField } from "@/lib/types/account";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function useUpdateProfile() {
  const t = useTranslations();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (field: UpdateProfileField) =>
      await updateProfileAction(field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: t("your-profile-updated"),
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: t("profile-update-failed"),
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending };
}
