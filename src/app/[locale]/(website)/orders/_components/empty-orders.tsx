import { useTranslations } from "next-intl";

export default function EmptyOrders() {
  const t = useTranslations("orders");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
      <svg
        viewBox="0 0 220 180"
        className="w-40 h-32 sm:w-48 sm:h-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* decorative dots */}
        <circle cx="20" cy="30" r="4" fill="#E9C2C9" />
        <circle cx="200" cy="40" r="3" fill="#E9C2C9" />
        <circle cx="30" cy="150" r="3" fill="#E9C2C9" />
        <path d="M185 130 l6 6 m0 -6 l-6 6" stroke="#E9C2C9" strokeWidth="2" />

        {/* back shadow box */}
        <rect
          x="35"
          y="55"
          width="150"
          height="80"
          rx="10"
          fill="#F6DCE0"
          transform="rotate(-4 110 95)"
        />

        {/* box body */}
        <rect
          x="45"
          y="70"
          width="130"
          height="70"
          rx="8"
          fill="#FDF1F2"
          stroke="#D98A96"
          strokeWidth="2"
        />

        {/* box flap / lid */}
        <path
          d="M45 78 L110 55 L175 78"
          fill="none"
          stroke="#C4596A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M45 78 L110 100 L175 78"
          fill="none"
          stroke="#C4596A"
          strokeWidth="2"
          strokeDasharray="5 5"
          opacity="0.7"
        />
        <line
          x1="110"
          y1="100"
          x2="110"
          y2="140"
          stroke="#C4596A"
          strokeWidth="2"
          strokeDasharray="5 5"
          opacity="0.7"
        />

        {/* ribbon */}
        <rect x="103" y="70" width="14" height="70" fill="#E9899A" opacity="0.6" />

        {/* magnifier looking for orders */}
        <circle
          cx="165"
          cy="115"
          r="16"
          fill="#FDF1F2"
          stroke="#7A2E3A"
          strokeWidth="3"
          opacity="0.85"
        />
        <line
          x1="176"
          y1="126"
          x2="188"
          y2="138"
          stroke="#7A2E3A"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M158 115 q7 -6 14 0"
          stroke="#7A2E3A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      <div className="space-y-1 max-w-xs sm:max-w-sm">
        <p className="text-base sm:text-lg font-semibold text-maroon-700 dark:text-softPink-200">
          {t("no-orders-found")}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          {t("no-orders-subtitle")}
        </p>
      </div>
    </div>
  );
}
