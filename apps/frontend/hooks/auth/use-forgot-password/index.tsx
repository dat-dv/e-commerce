"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  forgotPasswordSchema,
  TForgotPasswordSchema,
} from "@/components/molecules/forgot-password-form/forgot-password.schema";
import { authUseCase } from "@/domain/auth/use-cases";
import { useAuthStore } from "../use-auth-store";

const useForgotPassword = () => {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [isSent, setIsSent] = useState(false);

  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.loading);

  const methods = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const handleForgotPassword = async (data: TForgotPasswordSchema) => {
    setLoading(true);
    try {
      await authUseCase.forgotPassword.execute(data);

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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset link";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleForgotPassword,
    methods,
    isLoading,
    method,
    setMethod,
    isModalOpen,
    setIsModalOpen,
    modalContent,
    isSent,
  };
};

export default useForgotPassword;
