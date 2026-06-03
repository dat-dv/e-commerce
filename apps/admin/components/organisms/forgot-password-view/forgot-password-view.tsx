"use client";

import { ForgotPasswordForm } from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AuthBackLink,
  AuthCard,
  AuthPageFooter,
  AuthPageShell,
  AuthSuccessBanner,
} from "@/components/molecules/auth";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";

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

export const ForgotPasswordView = ({
  signInHref,
}: IForgotPasswordViewProps) => {
  const {
    isSent,
    isModalOpen,
    isSubmitting,
    sentBannerMessage,
    closeModal,
    submitForgotPassword,
  } = useForgotPassword();

  const methods = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <AuthPageShell variant="forgot-password">
      <AuthCard>
        <AuthBackLink href={signInHref} label="Back to sign in" />

        {isSent && <AuthSuccessBanner message={sentBannerMessage} />}

        <ForgotPasswordForm<TForgotPasswordSchema>
          id="admin-forgot-password-form"
          methods={methods}
          onSubmit={submitForgotPassword}
          labels={LABELS}
          signInHref={signInHref}
          method="email"
          showMethodTabs={false}
          isLoading={isSubmitting}
          isSent={isSent}
          isModalOpen={isModalOpen}
          onModalClose={closeModal}
          modalContent={SUCCESS_MODAL}
        />
      </AuthCard>

      <AuthPageFooter />
    </AuthPageShell>
  );
};

ForgotPasswordView.displayName = "ForgotPasswordView";
