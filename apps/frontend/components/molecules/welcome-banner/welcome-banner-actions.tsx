"use client";

import { Button } from "@ecommerce/ui";
import { APP_ROUTES } from "@/constants/routes";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HomeHeroActions({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const t = useTranslations("HomePage.hero");

  return (
    <div className="flex flex-col gap-4 pt-3 sm:flex-row">
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
          href={isLoggedIn ? APP_ROUTES.ORDERS : APP_ROUTES.PRODUCTS}
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
    </div>
  );
}
