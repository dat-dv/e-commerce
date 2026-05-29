import { AnimationContainer, AnimationItem, Button } from "@ecommerce/ui";

import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

export const AccessDenied = () => {
  const t = useTranslations("Common.accessDenied");

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
      <AnimationContainer className="max-w-sm space-y-8 text-center">
        <AnimationItem>
          <div className="relative mb-4 inline-block">
            <div className="absolute -inset-4 rounded-full bg-red-500/10 blur-3xl" />
            <h1 className="text-content relative text-5xl font-black tracking-tighter italic select-none sm:text-6xl">
              {t("title")}{" "}
              <span className="text-primary">{t("highlight")}</span>
            </h1>
          </div>
          <p className="text-content/80 mt-4 text-lg leading-relaxed font-medium opacity-50">
            {t("description")}
          </p>
        </AnimationItem>

        <AnimationItem>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href={APP_ROUTES.SIGN_IN}
              variant="primary"
              size="lg"
              className="shadow-primary/20 w-full px-10 shadow-xl transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              {t("signIn")}
            </Button>
            <Button
              href={APP_ROUTES.SIGN_UP}
              variant="ghost"
              size="lg"
              className="hover:bg-content/5 w-full px-10 sm:w-auto"
            >
              {t("createAccount")}
            </Button>
          </div>
        </AnimationItem>
      </AnimationContainer>
    </div>
  );
};

export default AccessDenied;
