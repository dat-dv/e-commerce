"use client";

import { Button } from "@ecommerce/ui";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export function OrderReturnPanel({
  onRequestReturn,
}: {
  onRequestReturn: () => void;
}) {
  const t = useTranslations("OrdersPage");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className={cn(
        UI_RADIUS.panel,
        "border-content/[0.05] bg-surface/40 flex flex-col gap-4 border p-6 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div>
        <h2 className="text-content text-sm font-bold">
          {t("detail.returnSectionTitle")}
        </h2>
        <p className="text-content/50 mt-1 text-sm leading-relaxed font-medium">
          {t("detail.returnSectionDesc")}
        </p>
      </div>
      <Button
        type="button"
        onClick={onRequestReturn}
        className={cn(
          UI_RADIUS.control,
          "bg-content text-surface hover:bg-primary inline-flex h-auto items-center justify-center gap-2 px-5 py-3 text-sm font-semibold opacity-100 shadow-lg shadow-black/10 transition-colors hover:opacity-100",
        )}
      >
        <RotateCcw className="h-4 w-4" />
        {t("detail.requestReturnBtn")}
      </Button>
    </motion.div>
  );
}
