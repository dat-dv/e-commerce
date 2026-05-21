"use client";

import Button from "@/components/atoms/button";
import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface ConfirmCancelModalProps {
  isOpen: boolean;
  isCancelling: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmCancelModal = ({
  isOpen,
  isCancelling,
  onClose,
  onConfirm,
}: ConfirmCancelModalProps) => {
  const t = useTranslations("OrdersPage");

  return (
    <AnimatePresence>
      {isOpen && (
        <AppDialog isOpen={isOpen} onClose={() => !isCancelling && onClose()}>
          <AppDialogPanel className="w-full max-w-sm bg-surface/80 backdrop-blur-2xl border border-content/[0.05] shadow-2xl rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20" />
            <AppDialogTitle
              as="h3"
              className="text-xl font-bold text-content tracking-tight mb-2"
            >
              {t("confirmCancel.title")}
            </AppDialogTitle>
            <p className="text-content/60 text-sm font-medium mb-8 leading-relaxed">
              {t("confirmCancel.description")}
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isCancelling}
                className={cn(
                  UI_RADIUS.control,
                  "flex-1 py-3 text-sm font-semibold text-content border-content/[0.1] hover:bg-content/[0.05] disabled:opacity-50 h-auto",
                )}
              >
                {t("confirmCancel.keep")}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isCancelling}
                className={cn(
                  UI_RADIUS.control,
                  "flex-1 flex items-center justify-center py-3 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 shadow-lg shadow-red-500/20 h-auto",
                )}
              >
                {isCancelling ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  t("confirmCancel.confirm")
                )}
              </Button>
            </div>
          </AppDialogPanel>
        </AppDialog>
      )}
    </AnimatePresence>
  );
};
