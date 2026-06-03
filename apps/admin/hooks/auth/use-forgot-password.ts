"use client";

import { toast } from "@ecommerce/ui";
import { useState, useTransition } from "react";

import { type TForgotPasswordSchema } from "@/components/organisms/forgot-password-view/forgot-password-view.schema";
import { adminAuthUseCase } from "@/domain/auth";

const SENT_BANNER_MESSAGE =
  "Password reset email sent. Please check your inbox.";

export const useForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, startSubmittingTransition] = useTransition();

  const submitForgotPassword = (data: TForgotPasswordSchema) => {
    startSubmittingTransition(async () => {
      try {
        await adminAuthUseCase.forgotPassword.execute(data);
        setIsSent(true);
        setIsModalOpen(true);
        toast.success(SENT_BANNER_MESSAGE);
      } catch {
        toast.error("Failed to send password reset email.");
      }
    });
  };

  return {
    isSent,
    isModalOpen,
    isSubmitting,
    sentBannerMessage: SENT_BANNER_MESSAGE,
    closeModal: () => setIsModalOpen(false),
    submitForgotPassword,
  };
};
