// NOTE: rewritten to match the new backend's documented /api/products query
// params: page, limit, categoryId, subCategoryId, occasionId, minPrice,
// maxPrice, minRating. The old Mongo-style filters ("price[gte]",
// "price[lte]", "category", "occasion", "rateAvg", "search") are not
// documented on the new API and were likely causing every filtered product
// request to fail (the new backend appears to reject unknown query params).
// "search"/text search has no documented equivalent yet - confirm with the
// backend team.
export function buildProductQueryParams(
  searchParams: ProductSearchParams,
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: Math.max(1, Number(searchParams.page) || 1),
    limit: 12,
  };

  if (searchParams.category) {
    params.categoryId = searchParams.category;
  }

  if (searchParams.occasion) {
    params.occasionId = searchParams.occasion;
  }

  if (searchParams.minPrice) {
    params.minPrice = searchParams.minPrice;
  }

  if (searchParams.maxPrice) {
    params.maxPrice = searchParams.maxPrice;
  }

  if (searchParams.rateCount) {
    params.minRating = searchParams.rateCount;
  }

  return params;
}
