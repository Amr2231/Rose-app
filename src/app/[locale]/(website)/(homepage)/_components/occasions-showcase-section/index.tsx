import { getOccasions } from "@/lib/services/occasions.service";
import OccasionsShowcaseCarousel from "./occasions-showcase-carousel";

export default async function OccasionsShowcaseSection() {
  const occasionsResponse = await getOccasions();
  const occasions = occasionsResponse.occasions;

  // Nothing to show — don't render an empty section.
  if (!occasions || occasions.length === 0) return null;

  return <OccasionsShowcaseCarousel occasions={occasions} />;
}
