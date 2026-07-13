"use client";

import { useState } from "react";
import { REGISTER_STEPS } from "@/lib/constants/auth.constant";
import { RegisterSteps } from "@/lib/types/auth";
import EmailStep from "./email-step";
import OtpStep from "./otp-step";
import DetailsStep from "./details-step";

export default function RegisterFlow() {
  // hooks
  const [step, setStep] = useState<RegisterSteps>(REGISTER_STEPS.EMAIL);
  const [email, setEmail] = useState("");

  // steps
  if (step === REGISTER_STEPS.OTP) {
    return (
      <OtpStep
        email={email}
        onBack={() => setStep(REGISTER_STEPS.EMAIL)}
        onVerified={() => setStep(REGISTER_STEPS.DETAILS)}
      />
    );
  }

  if (step === REGISTER_STEPS.DETAILS) {
    return <DetailsStep email={email} />;
  }

  return (
    <EmailStep
      defaultEmail={email}
      onSuccess={(sentToEmail) => {
        setEmail(sentToEmail);
        setStep(REGISTER_STEPS.OTP);
      }}
    />
  );
}
