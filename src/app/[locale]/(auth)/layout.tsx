import ToggleLanguage from "@/components/features/toggle-language";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/providers";
import { setRequestLocale } from "next-intl/server";
import { Pinyon_Script } from "next/font/google";

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-edwardian",
  weight: ["400"],
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <Providers>
      <main className={`flex flex-col lg:flex-row w-full min-h-screen ${pinyonScript.variable}`}>
        <div className="flex flex-col justify-center items-center my-10 lg:my-0 w-full lg:w-1/2 xl:w-2/5 px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="self-end mb-10 ">
            <ToggleLanguage />
          </div>
          <Image
            src="/assets/auth.png"
            alt="frame"
            width={280}
            height={45}
            className="mb-10 w-40 sm:w-auto lg:w-56 dark:brightness-150  "
            priority
          />
          {children}
          <Image
            src="/assets/auth.png"
            alt="frame"
            className="rotate-180 mt-10 w-40 sm:w-auto lg:w-56 dark:brightness-150  "
            width={280}
            height={45}
            priority
          />
        </div>
        <div className="hidden lg:block flex-1 relative">
          <Image
            src="/assets/banner.png"
            alt="Rose App Gifts"
            className="object-cover"
            fill
            priority
          />
        </div>
      </main>
    </Providers>
  );
}
