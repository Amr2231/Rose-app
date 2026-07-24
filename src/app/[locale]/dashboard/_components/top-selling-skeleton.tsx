import { Skeleton } from "@/components/ui/skeleton";

export function TopSellingSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between h-8 rounded px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-800"
        >
          <div className="flex items-center gap-1 min-w-0 flex-1 mr-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-16 shrink-0" />
          </div>
          <Skeleton className="h-4 w-14 shrink-0" />
        </div>
      ))}
    </div>
  );
}
