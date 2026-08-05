import { notFound } from "next/navigation";
import { Sarabun, Tajawal } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { cn } from "@/lib/utils/tailwind-merge";

const sarabun = Sarabun({
  subsets: ["latin"],
  variable: "--font-sarabun",
  weight: ["400", "500", "600", "700"],
});

const tajawal = Tajawal({
  subsets: ["latin"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700", "800", "900"],
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const locales = ["en", "ar"];

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        sarabun.className,
        sarabun.variable,
        tajawal.variable,
        "antialiased dark:bg-zinc-800 min-h-screen flex flex-col"
      )}
    >
      <NextIntlClientProvider locale={locale}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}