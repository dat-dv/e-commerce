"use client";

import Button from "@/components/atoms/button";
import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { XIcon } from "@/components/atoms/icons";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  return (
    <AppDialog isOpen={isOpen} onClose={onClose}>
      <AppDialogPanel className="mx-auto max-w-md w-full rounded-2xl bg-surface p-6 shadow-2xl border border-content/5">
        <div className="flex justify-between items-center mb-4">
          <AppDialogTitle className="text-xl font-bold text-content">
            {title}
          </AppDialogTitle>
          <Button
            variant="ghost"
            className="p-1 h-auto text-content/50 hover:text-content"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-content/70">{message}</p>
          <Button
            onClick={onClose}
            variant="primary"
            className="w-full h-11 text-sm rounded-xl"
          >
            Got it
          </Button>
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
}
