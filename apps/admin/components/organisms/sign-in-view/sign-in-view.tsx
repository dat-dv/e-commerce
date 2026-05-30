"use client";

import { SignInForm } from "@ecommerce/ui";
import { useForm } from "react-hook-form";

import {
  AuthBrandMark,
  AuthCard,
  AuthPageFooter,
  AuthPageShell,
} from "@/components/molecules/auth";
import { type TAdminSignInRequest } from "@/domain/auth/types/auth.model";

import { type ISignInViewProps } from "./sign-in-view.types";

const LABELS = {
  title: "Welcome back",
  description: "Sign in to the admin dashboard",
  emailLabel: "Email",
  emailPlaceholder: "admin@chotdon.vn",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••",
  forgotPassword: "Forgot password?",
  submitting: "Signing in…",
  submit: "Sign in",
  noAccount: "",
  registerLink: "",
} as const;

/**
 * Admin sign-in view — composes shared auth molecules with the
 * SignInForm UI package component. Business logic deferred for API integration.
 */
export const SignInView = ({ forgotPasswordHref }: ISignInViewProps) => {
  const methods = useForm<TAdminSignInRequest>({
    defaultValues: { email: "", password: "" },
  });

  // TODO: integrate with admin auth API
  const handleSubmit = (_data: TAdminSignInRequest) => {};

  return (
    <AuthPageShell variant="sign-in">
      <AuthCard>
        <AuthBrandMark />

        <SignInForm<TAdminSignInRequest>
          id="admin-sign-in-form"
          methods={methods}
          onSubmit={handleSubmit}
          labels={LABELS}
          forgotPasswordHref={forgotPasswordHref}
          registerHref="#"
        />
      </AuthCard>

      <AuthPageFooter />
    </AuthPageShell>
  );
};

SignInView.displayName = "SignInView";
