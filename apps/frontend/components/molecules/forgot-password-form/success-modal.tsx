"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "@/components/atoms/button";
import { XIcon } from "@/components/atoms/icons";
import React from "react";

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
    <Dialog open={isOpen} onClose={onClose} className="relative z-[9999]">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md w-full rounded-2xl bg-surface p-6 shadow-2xl border border-content/5">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-xl font-bold text-content">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-content/50 hover:text-content"
            >
              <XIcon className="w-6 h-6" />
            </button>
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
        </DialogPanel>
      </div>
    </Dialog>
  );
}
