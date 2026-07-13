"use client";
import { useState } from "react";
import { FORGOT_PASSWORD_STEPS } from "@/lib/constants/auth.constant";
import { ForgotPasswordSteps } from "@/lib/types/auth";
import { useTranslations } from "next-intl";
import EmailStep from "./email-step";
import EmailSentStep from "./email-sent-step";

export default function ForgotPasswordFlowLayout() {
  // translations
  const t = useTranslations("forgot-password");

  // states
  const [step, setStep] = useState<ForgotPasswordSteps>(
    FORGOT_PASSWORD_STEPS.EMAIL
  );
  const [email, setEmail] = useState<string>("");

  if (step === FORGOT_PASSWORD_STEPS.DONE) {
    return <EmailSentStep email={email} onBack={() => setStep(FORGOT_PASSWORD_STEPS.EMAIL)} />;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-50">
        {t("step-one-title")}
      </h1>
      <p className="text-zinc-800 dark:text-zinc-50">{t("step-one-subtitle")}</p>
      <EmailStep
        onSuccess={(sentToEmail) => {
          setEmail(sentToEmail);
          setStep(FORGOT_PASSWORD_STEPS.DONE);
        }}
      />
    </>
  );
}
