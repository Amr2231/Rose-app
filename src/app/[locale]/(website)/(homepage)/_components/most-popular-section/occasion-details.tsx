import { Sparkles } from "lucide-react";
import SafeImage from "@/components/shared/safe-image";
import { Occasion } from "@/lib/types/occasion";

type OccasionDetailsProps = {
  occasion?: Occasion;
};

export default function OccasionDetails({ occasion }: OccasionDetailsProps) {
  if (!occasion) return null;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-softPink-100 bg-gradient-to-br from-softPink-50 via-white to-white shadow-sm dark:border-zinc-700 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-900 sm:flex-row">
      {/* Image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64">
        <SafeImage
          src={occasion.image}
          alt={occasion.name}
          fill
          sizes="(max-width: 640px) 100vw, 256px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 sm:bg-gradient-to-r sm:from-black/25 sm:via-black/0 sm:to-black/0" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center gap-2 p-6 sm:p-8">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-softPink-500 dark:text-maroon-400">
          <Sparkles className="h-3.5 w-3.5" />
          Occasion
        </span>

        <h3 className="text-2xl font-bold capitalize leading-tight text-maroon-700 dark:text-softPink-200 sm:text-3xl">
          {occasion.name}
        </h3>

        {occasion.description && (
          <p className="max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base">
            {occasion.description}
          </p>
        )}
      </div>
    </div>
  );
}
