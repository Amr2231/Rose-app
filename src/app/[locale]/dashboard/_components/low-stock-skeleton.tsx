import { Skeleton } from "@/components/ui/skeleton";

// component
export function LowStockSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center h-8 py-2 border-b border-black/5 w-full"
        >
          <Skeleton className="h-4 w-48 flex-1 mr-4" />
          <Skeleton className="h-4 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}
