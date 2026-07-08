import { useTranslations } from "next-intl";

// Generic utility function
export function getFriendlyErrorMessage(
  error: string,
  t: ReturnType<typeof useTranslations>
) {
  if (!error) return t("generic-error");
  if (error.includes("fails to match the required pattern")) {
    return t("password-pattern-error");
  }
  return error;
}
