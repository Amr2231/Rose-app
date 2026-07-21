import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden shadow-sm border">
          {/* Header Skeleton */}
          <div className="bg-maroon-600 p-4">
            <Skeleton className="h-6 w-40 bg-white/40" />
          </div>

          {/* Body Skeleton */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-5 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
