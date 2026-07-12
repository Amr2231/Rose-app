import { useQuery } from "@tanstack/react-query";
import { OccasionsResponse } from "@/lib/types/occasion";
import { getOccasions } from "@/app/apis/get-occasions";

export function useOccasions(params: Record<string, string> = {}) {
  return useQuery<OccasionsResponse>({
    queryKey: ["occasions", params],
    queryFn: () => getOccasions(params),
  });
}
