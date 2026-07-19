"use client";

import { useQuery } from "@tanstack/react-query";
import Summary from "@/components/shared/summary";

export default function CheckoutSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  return (
    <Summary
      subtotal={data?.cart?.totalPrice ?? data?.price ?? 0}
      isLoading={isLoading}
      showCheckoutButton={false}
    />
  );
}
