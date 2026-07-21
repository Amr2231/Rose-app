"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useDeleteAccount } from "../_hooks/use-delete-account";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function DeleteDialog() {
  //Translations
  const t = useTranslations();

  //Mutations
  const { mutate, isPending } = useDeleteAccount();

  //Functions
  const handleDelete = () => {
    mutate(undefined, {
      onSuccess: async () => signOut({ callbackUrl: "/login" }),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-maroon-500 cursor-pointer">
          {t("delete-my-account")}
        </p>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[30rem] h-auto sm:h-[23.3rem]">
        <DialogDescription className="flex flex-col items-center justify-center ">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-5 rounded-full mt-12 ">
            <div className="bg-zinc-200 dark:bg-zinc-700 p-5 rounded-full ">
              <Trash size={30} className=" text-zinc-800 dark:text-zinc-100" />
            </div>
          </div>
          <p className="text-zinc-800 dark:text-zinc-100 text-xl font-semibold mt-6">
            {t("ask-for-delete-account")}
          </p>
          <p className="text-maroon-500 text-base font-normal">
            {t("action-cannot-undone")}
          </p>
        </DialogDescription>
        <DialogFooter className="mt-auto">
          <DialogClose asChild>
            <Button variant={"link"} className=" w-1/2">
              {t("not-doing")}
            </Button>
          </DialogClose>
          <Button
            isLoading={isPending}
            disabled={isPending}
            onClick={handleDelete}
            variant={"destructive"}
            className="w-1/2"
          >
            {t("yes-delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
