type ProductSearchParams = {
  occasion?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  rateCount?: string;
  page?: string;
  search?: string;
};

declare type ProductSearchParamsProps = {
  searchParams: Promise<ProductSearchParams>;
};

declare type ResolvedProductSearchParamsProps = {
  searchParams: ProductSearchParams;
};
