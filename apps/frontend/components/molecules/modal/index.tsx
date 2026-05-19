"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Dialog as RACDialog,
  Modal as RACModal,
  ModalOverlay as RACModalOverlay,
} from "react-aria-components";

import Button from "@/components/atoms/button";
import { XIcon } from "@/components/atoms/icons";

export default function Modal({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Common.modal");
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <RACModalOverlay
      isOpen
      onOpenChange={(open) => !open && handleClose()}
      isDismissable
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all"
    >
      <RACModal className="w-full max-w-md bg-surface border border-content/10 shadow-2xl rounded-3xl p-8 relative animate-in zoom-in-95 slide-in-from-bottom-5 outline-none">
        <RACDialog className="outline-none w-full h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-6 top-6"
            aria-label={t("close")}
          >
            <XIcon />
          </Button>
          {children}
        </RACDialog>
      </RACModal>
    </RACModalOverlay>
  );
}
