import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesTableSkeleton() {
  return (
    <table className="w-full border-collapse table-fixed rtl:table-auto ltr:table-fixed">
      <thead className="bg-red-50">
        <tr className="border-b bg-zinc-50 dark:bg-zinc-950 rtl:text-right ltr:text-left">
          <th className="py-3 w-64 rtl:pr-5 ltr:pl-5">
            <Skeleton className="h-5 w-32" />
          </th>
          <th>
            <Skeleton className="h-5 w-24" />
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <tr
            key={idx}
            className="border-b transition-colors my-2 hover:bg-maroon-50"
          >
            <td className="py-3 rtl:pr-5 ltr:pl-5">
              <Skeleton className="h-5 w-40" />
            </td>
            <td className="py-3 rtl:text-right">
              <Skeleton className="h-5 w-20" />
            </td>
            <td className="py-3 flex justify-end gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
