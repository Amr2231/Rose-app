"use client";
import LoginForm from "@/app/[locale]/(auth)/login/_components/login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPopup() {
  // translation
  const t = useTranslations("login-popup");

  // router
  const router = useRouter();

  return (
    <Card className="w-[28.125rem] max-w-[90vw] ">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader className="p-0  ">
          <TabsList className="w-full grid grid-cols-2 ">
            <TabsTrigger variant="active" value="login">
              {t("loginTab")}
            </TabsTrigger>

            {/* resirect to register path */}
            <Button
              variant={"inactive"}
              onClick={() => {
                router.push("/register");
              }}
            >
              {t("registerTab")}
            </Button>
          </TabsList>
        </CardHeader>
        <CardContent className="pt-6">
          <TabsContent value="login" className="mt-0">
            <LoginForm />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
