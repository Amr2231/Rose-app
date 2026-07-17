import { useQuery } from "@tanstack/react-query";
import { getProductDetails } from "../_services/product-details.service";

export const useFetchProductDetails = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ["product-details", id],
    queryFn: async () => getProductDetails(id),
    enabled: !!id,
  });

  return { productDetails: data, error };
};
