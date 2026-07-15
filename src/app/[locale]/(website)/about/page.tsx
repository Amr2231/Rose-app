import { Clock, HandHeart, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("about-page");

  const values = [
    {
      icon: HandHeart,
      title: t("value1.title"),
      text: t("value1.text"),
    },
    {
      icon: Clock,
      title: t("value2.title"),
      text: t("value2.text"),
    },
    {
      icon: Sparkles,
      title: t("value3.title"),
      text: t("value3.text"),
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
        <div className="space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-softPink-500">
            {t("heroLabel")}
          </h2>
          <h1 className="text-4xl font-bold leading-tight text-maroon-700">
            {t("heroHeading")}
          </h1>
          <p className="text-base leading-relaxed text-zinc-500">
            {t("heroParagraph1")}
          </p>
          <p className="text-base leading-relaxed text-zinc-500">
            {t("heroParagraph2")}
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center">
          <svg
            viewBox="0 0 400 400"
            className="w-full max-w-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="200" cy="200" r="180" fill="#FDF1F2" />
            {/* stems */}
            <path
              d="M200 330 L200 190"
              stroke="#7A2E3A"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M160 330 L185 200"
              stroke="#7A2E3A"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M240 330 L215 200"
              stroke="#7A2E3A"
              strokeWidth="4"
              fill="none"
            />
            {/* leaves */}
            <ellipse
              cx="170"
              cy="260"
              rx="18"
              ry="8"
              fill="#B65D6B"
              transform="rotate(-30 170 260)"
            />
            <ellipse
              cx="232"
              cy="260"
              rx="18"
              ry="8"
              fill="#B65D6B"
              transform="rotate(30 232 260)"
            />
            {/* roses */}
            <g transform="translate(200,150)">
              <circle r="34" fill="#7A2E3A" />
              <circle r="24" fill="#9B3D4D" />
              <circle r="13" fill="#C4596A" />
            </g>
            <g transform="translate(150,190)">
              <circle r="24" fill="#9B3D4D" />
              <circle r="16" fill="#C4596A" />
              <circle r="8" fill="#E497A3" />
            </g>
            <g transform="translate(250,190)">
              <circle r="24" fill="#9B3D4D" />
              <circle r="16" fill="#C4596A" />
              <circle r="8" fill="#E497A3" />
            </g>
          </svg>
        </div>
      </section>

      {/* Values */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-softPink-500">
            {t("valuesLabel")}
          </h2>
          <h3 className="text-3xl font-bold text-maroon-700">
            {t("valuesHeading")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-center text-center gap-3 rounded-2xl bg-softPink-100 p-8"
            >
              <div className="rounded-full bg-white p-3 text-maroon-600">
                <value.icon className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-semibold text-zinc-800">
                {value.title}
              </h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
