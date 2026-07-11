import { ProductRatingProps } from "@/lib/types/product";
import { Star } from "lucide-react";

export default function Rating({ rate }: ProductRatingProps) {

  // Variables
  const filledStars = Math.round(rate);

  return (
    <span className="flex items-center gap-1 w-28 mb-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i <= filledStars
            ? "fill-amber-500 text-amber-500"
            : "text-amber-500"
            }`}
        />
      ))}
    </span>
  );
}
