import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotAuthorized() {
  // Translations
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center">
      <div className="relative w-full max-w-md h-96">
        <Image
          src="/assets/lock-shield.jpg"
          alt="Not Authorized"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div>
        {/* title */}
        <p className="text-3xl font-semibold mb-4">
          {t("not-authorized.title")}
        </p>

        {/* description */}
        <p className="text-xl font-normal text-zinc-400 dark:text-zinc-500  dark:text-gray-400 space-y-4 leading-[1.5]  ">
          {t("not-authorized.description")}
        </p>

        {/* custom border */}
        <div className="mt-2 h-px w-3/4 bg-zinc-300 dark:bg-zinc-600 mx-auto"></div>
      </div>

      {/* button to redirect to home */}
      <div>
        {/* used custom styles because there isn't any variant match with figma */}
        <Button className="px-4 py-2 rounded-[.625rem] bg-transparent hover:bg-zinc-200 hover:dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-50 dark:border-zinc-800 w-44 h-10">
          <Link href={"/"}> {t("not-authorized.return-home")} </Link>
        </Button>
      </div>
    </div>
  );
}
