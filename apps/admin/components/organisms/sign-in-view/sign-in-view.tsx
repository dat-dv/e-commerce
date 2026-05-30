"use client";

import { SignInForm } from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AuthBrandMark,
  AuthCard,
  AuthPageFooter,
  AuthPageShell,
} from "@/components/molecules/auth";
import { useAdminAuth } from "@/hooks/use-auth";

import { signInSchema, type TSignInSchema } from "./sign-in-view.schema";
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

export const SignInView = ({ forgotPasswordHref }: ISignInViewProps) => {
  const { login, isLoading, error } = useAdminAuth();
  const methods = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = (data: TSignInSchema) => {
    login(data);
  };

  return (
    <AuthPageShell variant="sign-in">
      <AuthCard>
        <AuthBrandMark />

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <SignInForm<TSignInSchema>
          id="admin-sign-in-form"
          methods={methods}
          onSubmit={handleSubmit}
          labels={LABELS}
          forgotPasswordHref={forgotPasswordHref}
          registerHref="#"
          isLoading={isLoading}
        />
      </AuthCard>

      <AuthPageFooter />
    </AuthPageShell>
  );
};

SignInView.displayName = "SignInView";
