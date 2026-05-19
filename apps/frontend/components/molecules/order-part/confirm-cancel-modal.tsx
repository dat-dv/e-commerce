"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/aria/dialog";
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
              <button
                onClick={onClose}
                disabled={isCancelling}
                className="flex-1 py-3 text-sm font-semibold text-content border border-content/[0.1] rounded-xl hover:bg-content/[0.05] transition-all disabled:opacity-50"
              >
                {t("confirmCancel.keep")}
              </button>
              <button
                onClick={onConfirm}
                disabled={isCancelling}
                className="flex-1 flex items-center justify-center py-3 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                {isCancelling ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  t("confirmCancel.confirm")
                )}
              </button>
            </div>
          </AppDialogPanel>
        </AppDialog>
      )}
    </AnimatePresence>
  );
};
