"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
  Button,
  XIcon,
} from "@ecommerce/ui";

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
      <AppDialogPanel className="bg-surface border-content/5 mx-auto w-full max-w-md rounded-2xl border p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <AppDialogTitle className="text-content text-xl font-bold">
            {title}
          </AppDialogTitle>
          <Button
            variant="ghost"
            className="text-content/50 hover:text-content h-auto p-1"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <XIcon className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-content/70 text-sm">{message}</p>
          <Button
            onClick={onClose}
            variant="primary"
            className="h-11 w-full rounded-xl text-sm"
          >
            Got it
          </Button>
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
}
