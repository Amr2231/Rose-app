import { getCategories } from "@/lib/services/categories.service";
import { CategoriesResponse } from "@/lib/types/category";
import { useQuery } from "@tanstack/react-query";
interface UseCategoriesParams {
  page?: number;
  search?: string;
  limit?: number;
}

export function useCategories(params: UseCategoriesParams = {}) {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
}
