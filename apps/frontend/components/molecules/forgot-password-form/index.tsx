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
import { useState } from "react";
import { FormPhoneInput } from "../form/form-phone-input";
import SuccessModal from "./success-modal";

export default function ForgotPasswordForm() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [isSent, setIsSent] = useState(false);

  const methods = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: TForgotPasswordSchema) => {
    try {
      // Call API here!
      // await api.post("/auth/forgot-password", data);

      if (method === "email") {
        setModalContent({
          title: "Link Sent",
          message: `We have sent a reset password link to your email: ${data.email}`,
        });
      } else {
        setModalContent({
          title: "OTP Sent",
          message: `We have sent a 6-digit OTP to your phone: ${data.phone}`,
        });
      }
      setIsSent(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to send reset link:", error);
    }
  };

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

      <AppForm<TForgotPasswordSchema> methods={methods} onSubmit={onSubmit}>
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
          isLoading={isSubmitting}
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
