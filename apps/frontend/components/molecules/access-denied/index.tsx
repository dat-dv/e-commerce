import { AnimationContainer, AnimationItem } from "@/components/atoms/animate";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

export const AccessDenied = () => {
  const t = useTranslations("Common.accessDenied");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
      <AnimationContainer className="text-center space-y-8 max-w-sm">
        <AnimationItem>
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-3xl" />
            <h1 className="relative text-5xl sm:text-6xl font-black italic tracking-tighter text-content select-none">
              {t("title")}{" "}
              <span className="text-primary">{t("highlight")}</span>
            </h1>
          </div>
          <p className="mt-4 text-lg font-medium opacity-50 leading-relaxed text-content/80">
            {t("description")}
          </p>
        </AnimationItem>

        <AnimationItem>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href={APP_ROUTES.SIGN_IN}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-10 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {t("signIn")}
            </Button>
            <Button
              href={APP_ROUTES.SIGN_UP}
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto px-10 hover:bg-content/5"
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
