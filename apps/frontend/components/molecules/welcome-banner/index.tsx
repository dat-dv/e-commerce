import { AnimationContainer, AnimationItem } from "@/components/atoms/animate";
import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface HomeHeroSectionProps {
  name?: string;
}

export default function HomeHeroSection({ name }: HomeHeroSectionProps) {
  const isLoggedIn = !!name;
  const t = useTranslations("HomePage.hero");

  const headerLabel = isLoggedIn
    ? t.rich("titleLoggedIn", {
        name,
        italic: (chunks) => (
          <span className="text-content/30 font-light italic">{chunks}</span>
        ),
        br: () => <br />,
      })
    : t.rich("titlePublic", {
        italic: (chunks) => (
          <span className="text-content/30 font-light italic">{chunks}</span>
        ),
        br: () => <br />,
      });

  return (
    <section className="border-content/[0.03] relative mb-8 flex min-h-[420px] items-center overflow-hidden border-b">
      <AppContainer className="relative z-10 w-full py-16">
        <AnimationContainer className="flex max-w-3xl flex-col items-start gap-5">
          <AnimationItem>
            <h1 className="text-content text-5xl leading-none font-black tracking-[-0.05em] uppercase md:text-7xl">
              {headerLabel}
            </h1>
          </AnimationItem>

          <AnimationItem>
            <p className="text-content/50 animate-in fade-in slide-in-from-bottom-3 max-w-2xl text-base leading-relaxed font-medium tracking-tight delay-100 duration-700 md:text-lg">
              {isLoggedIn ? t("descLoggedIn") : t("descPublic")}
            </p>
          </AnimationItem>

          <AnimationItem className="flex flex-col gap-4 pt-3 sm:flex-row">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={APP_ROUTES.PRODUCTS}
                variant="primary"
                size="lg"
                className={cn(
                  UI_RADIUS.control,
                  "shadow-primary/20 px-8 text-sm font-bold shadow-xl",
                )}
              >
                {isLoggedIn ? t("btnContinueShopping") : t("btnStartShopping")}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={isLoggedIn ? APP_ROUTES.ORDERS : APP_ROUTES.CATEGORIES}
                variant="ghost"
                size="lg"
                className={cn(
                  UI_RADIUS.control,
                  "border-content/[0.08] hover:bg-content/[0.02] border px-8 text-sm font-bold",
                )}
              >
                {isLoggedIn ? t("btnViewOrders") : t("btnExploreCollections")}
              </Button>
            </motion.div>
          </AnimationItem>
        </AnimationContainer>
      </AppContainer>
    </section>
  );
}
