import { getOccasions } from "@/lib/services/occasions.service";
import { getProducts } from "@/lib/services/products.service";
import MostPopular from "./most-popular";
import { OccProps } from "@/lib/types/occasion";

export default async function MostPopularSection({ searchParams }: OccProps) {
  const resolvedSearchParams = await searchParams;

  const occasionsResponse = await getOccasions();
  const occasions = occasionsResponse.occasions;

  const activeOccasion =
    resolvedSearchParams.occasion || occasions[0]?._id;

  const products = await getProducts({
    occasionId: activeOccasion,
    limit: 12,
  });

  return (
    <MostPopular
      occasions={occasions}
      initialOccasion={activeOccasion}
      initialProducts={products}
    />
  );
}
