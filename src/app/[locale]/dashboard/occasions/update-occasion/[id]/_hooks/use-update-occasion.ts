import { useToast } from "@/hooks/use-toast";
import { updateOccasionAction } from "@/lib/actions/dashboard-occasions.actions";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function useUpdateOccasion() {
  const t = useTranslations();
  const { toast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({
      occasionId,
      formData,
    }: {
      occasionId: string;
      formData: FormData;
    }) => await updateOccasionAction(occasionId, formData),
    onSuccess: () => {
      toast({
        title: t("occasion-updated"),
        variant: "success",
      });
    },
    onError: (err) => {},
  });

  return { mutate, isPending, error };
}
