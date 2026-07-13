"use client";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useConfirmEmailVerification } from "../_hooks/use-confirm-email-verification";
import { useSendEmailVerification } from "../_hooks/use-send-email-verification";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpFormValues } from "@/lib/schemas/auth.schema";

// constants
const RESEND_TIMER_KEY = "register_resend_otp_expire_at";
const RESEND_DURATION = 60;

// props
type OtpStepProps = {
  email: string;
  onBack: () => void;
  onVerified: () => void;
};

export default function OtpStep({ email, onBack, onVerified }: OtpStepProps) {
  // translations
  const t = useTranslations("verify");

  // hooks
  const { confirmEmailVerification, isPending, error } =
    useConfirmEmailVerification();
  const { sendEmailVerification, isPending: isResending } =
    useSendEmailVerification();

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  // form
  const translatedOtpSchema = otpSchema.refine(
    (data) => data.otp.length === 6,
    { message: t("otp-validation"), path: ["otp"] },
  );

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(translatedOtpSchema),
    defaultValues: { otp: "" },
  });

  // start resend timer
  const startResendTimer = () => {
    const expireAt = Date.now() + RESEND_DURATION * 1000;
    localStorage.setItem(RESEND_TIMER_KEY, expireAt.toString());
    setSecondsLeft(RESEND_DURATION);
  };

  // resend code
  const handleResendCode = () => {
    sendEmailVerification({ email }, { onSuccess: startResendTimer });
  };

  // on submit handler
  const onSubmit = (data: OtpFormValues) => {
    confirmEmailVerification(
      { email, code: data.otp },
      { onSuccess: () => onVerified() },
    );
  };

  // resend timer
  useEffect(() => {
    const expireAt = localStorage.getItem(RESEND_TIMER_KEY);
    if (!expireAt) return;

    const diff = Math.ceil((+expireAt - Date.now()) / 1000);
    diff > 0 ? setSecondsLeft(diff) : localStorage.removeItem(RESEND_TIMER_KEY);
  }, []);

  useEffect(() => {
    if (!secondsLeft) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (!prev || prev <= 1) {
          localStorage.removeItem(RESEND_TIMER_KEY);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  return (
    <div className="w-full max-w-[25.3rem] lg:max-w-[30rem] mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border-b border-zinc-200 pb-4 mb-10 dark:border-zinc-600">
            {/* Heading */}
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-50">
              {t("title")}
            </h2>
            {/* email */}
            <p className="text-zinc-800 dark:text-zinc-50">
              {t("send-to")} {email}
              <button
                type="button"
                onClick={onBack}
                className="text-blue-700 dark:text-blue-400 font-medium underline ms-1"
              >
                {t("edit-email")}
              </button>
            </p>
          </div>

          {/* otp input */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} className="mx-auto" />
                    ))}
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* resend code */}
          <div className="text-right mt-6 me-8">
            {secondsLeft ? (
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t("resend-after")} {secondsLeft}s
              </span>
            ) : (
              <Button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                variant={"ghost"}
                className="text-base font-medium text-zinc-800 dark:text-zinc-50"
              >
                {t("send-code")}
              </Button>
            )}
          </div>

          {error && (
            <p className="text-red-500 font-semibold capitalize">
              {error.message}
            </p>
          )}

          {/* submit button */}
          <div className="py-3 px-4 border-b border-zinc-200 dark:border-zinc-600">
            <Button
              type="submit"
              isLoading={isPending}
              className="w-full my-9 bg-maroon-600 text-white font-medium text-base capitalize dark:bg-softPink-300 dark:text-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("verify-otp")}
            </Button>
          </div>

          {/* help link and contact */}
          <p className="text-sm font-medium text-center mt-5 text-zinc-800 dark:text-zinc-50">
            {t("help")}
            <span className="font-bold text-maroon-700 dark:text-softPink-300">
              {t("contact")}
            </span>
          </p>
        </form>
      </Form>
    </div>
  );
}
