"use client";

import Button from "@/components/atoms/button";
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
      className="flex flex-col gap-4 rounded-2xl border border-content/[0.05] bg-surface/40 p-6 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 className="text-sm font-bold text-content">
          {t("detail.returnSectionTitle")}
        </h2>
        <p className="mt-1 text-sm font-medium leading-relaxed text-content/50">
          {t("detail.returnSectionDesc")}
        </p>
      </div>
      <Button
        type="button"
        onClick={onRequestReturn}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-content px-5 py-3 text-sm font-semibold text-surface shadow-lg shadow-black/10 transition-colors hover:bg-primary h-auto opacity-100 hover:opacity-100"
      >
        <RotateCcw className="h-4 w-4" />
        {t("detail.requestReturnBtn")}
      </Button>
    </motion.div>
  );
}
