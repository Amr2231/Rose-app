"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { MailCheck } from "lucide-react";

// props
type EmailSentStepProps = {
  email: string;
  onBack: () => void;
};

export default function EmailSentStep({ email, onBack }: EmailSentStepProps) {
  // translations
  const t = useTranslations();

  return (
    <div className="w-full max-w-[25.5rem] lg:max-w-[30rem] dark:text-zinc-50 text-zinc-800 text-center">
      <MailCheck
        className="mx-auto mb-4 text-maroon-600 dark:text-softPink-300"
        size={40}
      />
      <h2 className="text-2xl font-semibold">{t("check-your-email-title")}</h2>
      <p className="mb-6 font-medium text-base">
        {/* email text */}
        {t.rich("check-your-email-text", {
          email: () => <span className="font-semibold">{email}</span>,
        })}
      </p>

      {/* back button */}
      <Button variant="outline" className="w-full" onClick={onBack}>
        {t("use-a-different-email")}
      </Button>

      {/* login button */}
      <p className="text-center mt-5 font-medium">
        {t.rich("dont-have-an-account", {
          a: (chunk) => (
            <Link
              href="/login"
              className="text-maroon-700 font-bold dark:text-softPink-200"
            >
              {chunk}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}
