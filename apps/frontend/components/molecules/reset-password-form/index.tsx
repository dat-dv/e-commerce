"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordSchema, TResetPasswordSchema } from "./reset-password.schema";
import AppForm from "../form/app-form";
import { FormInput } from "../form/form-input";
import { FormButton } from "../form/form-button";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const methods = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: TResetPasswordSchema) => {
    if (!token) {
      alert("Invalid or missing token");
      return;
    }
    
    try {
      // Call API here!
      // await api.post("/auth/reset-password", { token, password: data.password });
      console.log("Resetting password with token:", token, "and data:", data);
      
      // Redirect to sign in!
      router.push(APP_ROUTES.SIGN_IN);
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-content">Reset Password</h1>
        <p className="text-sm opacity-60 mt-1">
          Enter your new password below.
        </p>
      </div>

      <AppForm<TResetPasswordSchema> methods={methods} onSubmit={onSubmit}>
        <FormInput
          name="password"
          label="New Password"
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
        />

        <FormInput
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
        />

        <FormButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Resetting..."
          className="mt-2"
        >
          Reset Password
        </FormButton>
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          Remembered your password?{" "}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_IN}
            className="text-primary font-bold hover:underline underline-offset-4 px-0 opacity-100"
          >
            Sign In
          </Button>
        </p>
      </div>
    </div>
  );
}
