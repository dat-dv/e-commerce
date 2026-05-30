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
  const methods = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // TODO: integrate with admin auth API
  const handleSubmit = (_data: TSignInSchema) => {};

  return (
    <AuthPageShell variant="sign-in">
      <AuthCard>
        <AuthBrandMark />

        <SignInForm<TSignInSchema>
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
