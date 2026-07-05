import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";
import { CURRENCY } from "@/lib/constants/global.constant";

export default getRequestConfig(async ({ requestLocale }) => {
  // Static for now, we'll change this later
  const requested = await requestLocale;
  // Validate requested locale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  // Determine numbering system based on locale
  const numberingSystem = locale === "ar" ? "arab" : "latn";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    formats: {
      // Custom number formats
      number: {
        // Define custom number formats
        "currency-full": {
          style: "currency",
          currency: CURRENCY,
          numberingSystem,
        },
        "percentage-base": {
          style: "percent",
          numberingSystem,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      },
      // Custom date and time formats
      dateTime: {
        "date-max": {
          year: "numeric",
          month: "long",
          day: "2-digit",
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          dayPeriod: "long",
          numberingSystem,
        },
        "time-only": {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          numberingSystem,
        },
      },
    },
  };
});
