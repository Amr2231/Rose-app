import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export type Params = { locale: Locale };

export type RouteProps = {
  params: Params;
  searchParams: Record<string, string | string[] | undefined>;
};

export type Translations = Awaited<ReturnType<typeof getTranslations>>;
