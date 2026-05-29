"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
  Button,
} from "@ecommerce/ui";

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
          <AppDialogPanel className="bg-surface/80 border-content/[0.05] relative w-full max-w-sm overflow-hidden rounded-3xl border p-8 shadow-2xl backdrop-blur-2xl">
            <div className="absolute top-0 left-0 h-1 w-full bg-red-500/20" />
            <AppDialogTitle
              as="h3"
              className="text-content mb-2 text-xl font-bold tracking-tight"
            >
              {t("confirmCancel.title")}
            </AppDialogTitle>
            <p className="text-content/60 mb-8 text-sm leading-relaxed font-medium">
              {t("confirmCancel.description")}
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isCancelling}
                className={cn(
                  UI_RADIUS.control,
                  "text-content border-content/[0.1] hover:bg-content/[0.05] h-auto flex-1 py-3 text-sm font-semibold disabled:opacity-50",
                )}
              >
                {t("confirmCancel.keep")}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isCancelling}
                className={cn(
                  UI_RADIUS.control,
                  "flex h-auto flex-1 items-center justify-center bg-red-500 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50",
                )}
              >
                {isCancelling ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
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
