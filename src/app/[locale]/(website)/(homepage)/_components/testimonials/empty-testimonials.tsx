import { getTranslations } from "next-intl/server";

export default async function EmptyTestimonials() {
  const t = await getTranslations("testimonials");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
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

        {/* quote mark */}
        <text
          x="110"
          y="105"
          textAnchor="middle"
          fontSize="52"
          fontFamily="Georgia, serif"
          fill="#C4596A"
          opacity="0.6"
        >
          &ldquo;
        </text>

        {/* face */}
        <circle cx="88" cy="120" r="2.5" fill="#7A2E3A" opacity="0.5" />
        <circle cx="132" cy="120" r="2.5" fill="#7A2E3A" opacity="0.5" />
        <path
          d="M92 130 q18 -10 36 0"
          stroke="#7A2E3A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
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
