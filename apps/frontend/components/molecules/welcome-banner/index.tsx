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
          <span className="italic font-light text-content/30">{chunks}</span>
        ),
        br: () => <br />,
      })
    : t.rich("titlePublic", {
        italic: (chunks) => (
          <span className="italic font-light text-content/30">{chunks}</span>
        ),
        br: () => <br />,
      });

  return (
    <section className="relative mb-8 min-h-[420px] flex items-center overflow-hidden border-b border-content/[0.03]">
      <AppContainer className="relative z-10 w-full py-16">
        <AnimationContainer className="max-w-3xl flex flex-col items-start gap-5">
          <AnimationItem>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-none uppercase text-content">
              {headerLabel}
            </h1>
          </AnimationItem>

          <AnimationItem>
            <p className="text-base md:text-lg text-content/50 max-w-2xl font-medium leading-relaxed tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
              {isLoggedIn ? t("descLoggedIn") : t("descPublic")}
            </p>
          </AnimationItem>

          <AnimationItem className="flex flex-col sm:flex-row gap-4 pt-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={APP_ROUTES.PRODUCTS}
                variant="primary"
                size="lg"
                className={cn(
                  UI_RADIUS.control,
                  "px-8 text-sm font-bold shadow-xl shadow-primary/20",
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
                  "px-8 text-sm font-bold border border-content/[0.08] hover:bg-content/[0.02]",
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
