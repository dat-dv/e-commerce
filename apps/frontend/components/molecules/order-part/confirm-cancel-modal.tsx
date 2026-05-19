"use client";

import {
  AriaDialog,
  AriaDialogPanel,
  AriaDialogTitle,
} from "@/components/atoms/aria/dialog";
import { motion, AnimatePresence } from "framer-motion";
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
        <AriaDialog
          isOpen={isOpen}
          onClose={() => !isCancelling && onClose()}
          className="relative z-[100]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
          </motion.div>

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <AriaDialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-surface/80 backdrop-blur-2xl border border-content/[0.05] shadow-2xl rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20" />
              <AriaDialogTitle
                as="h3"
                className="text-xl font-bold text-content tracking-tight mb-2"
              >
                {t("confirmCancel.title")}
              </AriaDialogTitle>
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
            </AriaDialogPanel>
          </div>
        </AriaDialog>
      )}
    </AnimatePresence>
  );
};
