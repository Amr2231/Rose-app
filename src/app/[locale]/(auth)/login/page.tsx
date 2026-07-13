import { Link } from "@/i18n/navigation";
import LoginForm from "./_components/login-form";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Login | Rose App",
  description: "login to your account",
}

export default function Page() {
  // translation
  const t = useTranslations("login");

  return (
    <main className="flex flex-col justify-center items-center w-full gap-10">
      <div>
        {/* Heading */}
        <h3 className="font-edwardian text-4xl lg:text-5xl text-maroon-700 text-center dark:text-softPink-300">
          {t("heading")}
        </h3>
        <LoginForm />
      </div>
      <div className="flex gap-2 justify-center border-t border-zinc-200 border-solid pt-5">
        <p className="text-zinc-800">{t("noAccount")}</p>
        <Link href={"/register"} className="text-maroon-700 font-medium">
          {t("createAccount")}
        </Link>
      </div>
    </main>
  );
}
