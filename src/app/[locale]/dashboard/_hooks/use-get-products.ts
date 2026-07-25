"use client";

import { useQuery } from "@tanstack/react-query";
import { GetProductsResponse } from "@/lib/types/dashboard/product.d";

// fetch products
async function fetchProducts(
  page: number,
  limit: number,
  search: string
): Promise<GetProductsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  });

  // fetch
  const res = await fetch(`/api/dashboard/products?${params}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// custom hook
export function useGetProducts(
  page: number = 1,
  limit: number = 12,
  search: string = ""
) {
  // Queries
  return useQuery<GetProductsResponse>({
    queryKey: ["dashboard-products", page, limit, search],
    queryFn: () => fetchProducts(page, limit, search),
    staleTime: 1000 * 30, 
  });
}
