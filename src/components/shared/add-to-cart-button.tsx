"use client";

import { useAddToCart } from "@/app/[locale]/(website)/products/[id]/_hooks/use-add-to-cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

type AddToCartButtonProps = {
  productId: string;
  quantityInStock: number;
  children: React.ReactNode;
  className?: string;
};

export default function AddToCartButton({
  productId,
  quantityInStock,
  children,
  className,
}: AddToCartButtonProps) {
  const t = useTranslations();
  const { mutate, isPending } = useAddToCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (quantityInStock < 1) {
      toast({
        description: t("cart.out-of-stock-toast"),
        variant: "destructive",
      });
      return;
    }

    mutate({ product: productId, quantity: 1 });
  };

  return (
    <Button
      onClick={handleAddToCart}
      isLoading={isPending}
      disabled={isPending}
      className={className}
    >
      {children}
    </Button>
  );
}
