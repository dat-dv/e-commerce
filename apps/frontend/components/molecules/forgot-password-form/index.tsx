"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  TForgotPasswordSchema,
} from "./forgot-password.schema";
import AppForm from "../form/app-form";
import { FormInput } from "../form/form-input";
import { FormButton } from "../form/form-button";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { FormPhoneInput } from "../form/form-phone-input";
import SuccessModal from "./success-modal";
import useForgotPassword from "@/hooks/auth/use-forgot-password";

export default function ForgotPasswordForm() {
  const {
    handleForgotPassword,
    methods,
    isLoading,
    method,
    setMethod,
    isModalOpen,
    setIsModalOpen,
    modalContent,
    isSent,
  } = useForgotPassword();

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-content">Forgot Password</h1>
        <p className="text-sm opacity-60 mt-1">
          Enter your email or phone number to receive a reset link/OTP.
        </p>
      </div>

      <div className="flex p-1 bg-content/5 rounded-xl gap-1">
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            method === "email"
              ? "bg-white shadow-sm text-primary"
              : "text-content/60 hover:text-content",
          )}
          onClick={() => setMethod("email")}
        >
          Email
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            method === "phone"
              ? "bg-white shadow-sm text-primary"
              : "text-content/60 hover:text-content",
          )}
          onClick={() => setMethod("phone")}
        >
          Phone
        </button>
      </div>

      <AppForm<TForgotPasswordSchema> methods={methods} onSubmit={handleForgotPassword}>
        {method === "email" ? (
          <FormInput
            name="email"
            label="Email"
            placeholder="name@example.com"
            type="email"
            autoComplete="email"
          />
        ) : (
          <FormPhoneInput name="phone" label="Phone Number" />
        )}

        <FormButton
          type="submit"
          isLoading={isLoading}
          loadingText="Sending..."
          className="mt-4"
          disabled={isSent}
        >
          {method === "email" ? "Send Reset Link" : "Send OTP"}
        </FormButton>
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          Remembered your password?{" "}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_IN}
            className="text-primary font-bold hover:underline underline-offset-4 px-0 opacity-100 hover:bg-transparent"
          >
            Sign In
          </Button>
        </p>
      </div>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </div>
  );
}
