import { AddCheckoutCash } from "@/lib/actions/checkout.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "./use-toast";

export function useCheckout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations();
  const { toast } = useToast();

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: async (values: CreateOrderPayload) => AddCheckoutCash(values),
    onSuccess: (data, variables) => {
      // cart gets cleared on the backend once the order is created
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // NEW backend: POST /api/orders just creates the order for both cash
      // and card - there's no more Stripe-hosted redirect URL in the
      // response. For CREDIT_CARD orders, actually collecting card details
      // and completing payment needs a follow-up step via
      // POST /api/payments/create-intent + POST /api/payments/confirm
      // (see lib/actions/payments.actions.ts) using Stripe Elements, which
      // isn't wired into the UI yet.
      if (variables.paymentMethod === "CREDIT_CARD") {
        toast({
          title: t("toast.success"),
          description: t("checkout.orderPlaced"),
          variant: "success",
        });
        router.push(`/orders/${data?.id ?? data?._id ?? ""}`);
        return;
      }

      toast({
        title: t("toast.success"),
        description: t("checkout.orderPlaced"),
        variant: "success",
      });

      router.push("/orders");
    },
    onError: (error: Error) => {
      toast({
        title: t("toast.error"),
        description: error.message || t("checkout.orderFailed"),
        variant: "destructive",
      });
    },
  });

  return { checkout, isPending };
}
