import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getCartService } from "../_services/cart.service";

export function useGetCart() {
  const { status } = useSession();
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartService,
    enabled: status === "authenticated",
  });

  return { cart: data };
}
