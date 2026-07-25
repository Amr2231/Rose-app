import { useToast } from "@/hooks/use-toast";
import { deleteOccasionAction } from "@/lib/actions/dashboard-occasions.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function useDeleteOccasions() {
  const t = useTranslations();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (occasionId: string) =>
      await deleteOccasionAction(occasionId),
    onSuccess: () => {
      toast({
        title: t("occasion-deleted"),
        variant: "success",
      });
      // refetch the list of occasions after one has been removed
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
    },
    onError: (err) => console.log(err),
  });

  return { mutate, isPending };
}
