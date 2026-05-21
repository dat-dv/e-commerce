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
      className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
    >
      <RACModal className="bg-surface border-content/10 animate-in zoom-in-95 slide-in-from-bottom-5 relative w-full max-w-md rounded-3xl border p-8 shadow-2xl outline-none">
        <RACDialog className="h-full w-full outline-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-6 right-6"
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
