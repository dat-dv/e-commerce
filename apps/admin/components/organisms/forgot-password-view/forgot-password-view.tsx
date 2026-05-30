"use client";

import { ForgotPasswordForm } from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  AuthBackLink,
  AuthCard,
  AuthPageFooter,
  AuthPageShell,
  AuthSuccessBanner,
} from "@/components/molecules/auth";

import {
  forgotPasswordSchema,
  type TForgotPasswordSchema,
} from "./forgot-password-view.schema";
import { type IForgotPasswordViewProps } from "./forgot-password-view.types";

const LABELS = {
  title: "Forgot password?",
  description: "Enter your email address to receive a password reset link",
  emailTab: "Email",
  phoneTab: "Phone",
  emailLabel: "Admin email",
  emailPlaceholder: "admin@chotdon.vn",
  phoneLabel: "Phone number",
  submitting: "Sending…",
  sendResetLink: "Send reset link",
  sendOtp: "Send OTP",
  rememberedPassword: "Remembered your password? ",
  loginLink: "Sign in",
  modalCloseLabel: "Close dialog",
  modalConfirmLabel: "Got it",
} as const;

const SUCCESS_MODAL = {
  title: "Email sent!",
  message:
    "We've sent a password reset link to your email address. Please check your inbox (and spam folder) and follow the instructions within 15 minutes.",
};

const SENT_BANNER_MESSAGE =
  "Password reset email sent. Please check your inbox.";

export const ForgotPasswordView = ({
  signInHref,
}: IForgotPasswordViewProps) => {
  const [isSent, setIsSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // TODO: integrate with admin auth API
  const handleSubmit = (_data: TForgotPasswordSchema) => {
    setIsSent(true);
    setIsModalOpen(true);
  };

  return (
    <AuthPageShell variant="forgot-password">
      <AuthCard>
        <AuthBackLink href={signInHref} label="Back to sign in" />

        {isSent && <AuthSuccessBanner message={SENT_BANNER_MESSAGE} />}

        <ForgotPasswordForm<TForgotPasswordSchema>
          id="admin-forgot-password-form"
          methods={methods}
          onSubmit={handleSubmit}
          labels={LABELS}
          signInHref={signInHref}
          method="email"
          showMethodTabs={false}
          isSent={isSent}
          isModalOpen={isModalOpen}
          onModalClose={() => setIsModalOpen(false)}
          modalContent={SUCCESS_MODAL}
        />
      </AuthCard>

      <AuthPageFooter />
    </AuthPageShell>
  );
};

ForgotPasswordView.displayName = "ForgotPasswordView";
