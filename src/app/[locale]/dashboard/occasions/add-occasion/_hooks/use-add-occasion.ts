import { useToast } from "@/hooks/use-toast";
import { addOccasionAction } from "@/lib/actions/dashboard-occasions.actions";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function useAddOccasion() {
  const t = useTranslations();
  const { toast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (formData: FormData) => await addOccasionAction(formData),
    onSuccess: () => {
      toast({
        title: t("occasion-added"),
        variant: "success",
      });
    },
    onError: (err) => console.log(err),
  });

  return { mutate, isPending, error };
}
