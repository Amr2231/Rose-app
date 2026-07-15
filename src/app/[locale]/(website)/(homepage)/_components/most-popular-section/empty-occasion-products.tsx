import { useTranslations } from "next-intl";

export default function EmptyOccasionProducts() {
  const t = useTranslations("most-popular");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <svg
        viewBox="0 0 220 180"
        className="w-48 h-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* decorative dots */}
        <circle cx="20" cy="30" r="4" fill="#E9C2C9" />
        <circle cx="200" cy="40" r="3" fill="#E9C2C9" />
        <circle cx="30" cy="150" r="3" fill="#E9C2C9" />
        <path d="M185 130 l6 6 m0 -6 l-6 6" stroke="#E9C2C9" strokeWidth="2" />

        {/* back card */}
        <rect
          x="30"
          y="30"
          width="140"
          height="90"
          rx="14"
          fill="#F6DCE0"
          transform="rotate(-6 100 75)"
        />
        {/* front card */}
        <rect
          x="35"
          y="45"
          width="150"
          height="95"
          rx="14"
          fill="#FDF1F2"
          stroke="#D98A96"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* gift box */}
        <rect x="86" y="82" width="48" height="38" rx="4" fill="#C4596A" opacity="0.85" />
        <rect x="86" y="82" width="48" height="10" fill="#A83E4E" />
        <rect x="106" y="82" width="8" height="38" fill="#A83E4E" />
        {/* ribbon bow */}
        <path
          d="M110 82 c-6 -10 -20 -10 -18 0 c2 8 12 6 18 0 c6 6 16 8 18 0 c2 -10 -12 -10 -18 0 z"
          fill="#A83E4E"
        />

        {/* sparkles */}
        <path d="M150 70 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#D98A96" opacity="0.7" />
        <path d="M64 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#D98A96" opacity="0.7" />
      </svg>

      <div className="space-y-1">
        <p className="text-lg font-semibold text-maroon-700 dark:text-softPink-200">
          {t("empty")}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          {t("empty-subtitle")}
        </p>
      </div>
    </div>
  );
}
