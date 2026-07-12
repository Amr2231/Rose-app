import { getSingleProduct } from "@/lib/services/single-product.service";
import { useQuery } from "@tanstack/react-query";

export function useSingleProduct(id : string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id),
  });
}
