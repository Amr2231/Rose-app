import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-4 sm:p-6 lg:p-10 lg:h-[32.7rem] w-full max-w-[80rem] mx-auto my-10 animate-pulse">
      {/* LEFT IMAGE SECTION */}
      <div className="space-y-4">
        <Skeleton className="w-full h-[250px] sm:h-[400px] rounded-xl" />

        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-[70px] h-[90px] sm:w-[90px] sm:h-[110px] rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* RIGHT INFO SECTION */}
      <div className="flex flex-col h-full space-y-4">
        {/* Title */}
        <Skeleton className="h-10 w-3/4" />

        {/* Price & Stock */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>

        {/* Rating */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Description */}
        <div className="space-y-2 max-h-48">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Buttons at bottom */}
        <div className="mt-auto flex gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
