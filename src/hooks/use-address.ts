import { getAddresses } from "@/lib/services/addresses.service";
import { useQuery } from "@tanstack/react-query";

export const useAddresses = () => {
  return useQuery<GetAddressesResponse>({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });
};
