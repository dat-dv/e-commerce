"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

import { Modal as SharedModal } from "@ecommerce/ui";

export default function Modal({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Common.modal");
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <SharedModal isOpen onClose={handleClose} closeLabel={t("close")}>
      {children}
    </SharedModal>
  );
}
