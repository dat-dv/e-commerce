"use client";

import React from "react";

import { AnimationContainer, AnimationItem } from "../../atoms/animate";
import Button from "../../atoms/button";

export interface AccessDeniedLabels {
  title?: string;
  highlight?: string;
  description?: string;
  signIn?: string;
  createAccount?: string;
}

export interface AccessDeniedProps {
  signInHref?: string;
  signUpHref?: string;
  linkComponent?: React.ElementType;
  labels?: AccessDeniedLabels;
}

/**
 * AccessDenied displays a stylized, animated "Access Denied" page state.
 */
export const AccessDenied = ({
  signInHref = "/sign-in",
  signUpHref = "/sign-up",
  linkComponent,
  labels = {},
}: AccessDeniedProps) => {
  const title = labels.title ?? "Access";
  const highlight = labels.highlight ?? "Denied";
  const description =
    labels.description ?? "You do not have permission to access this page.";
  const signInLabel = labels.signIn ?? "Sign In";
  const createAccountLabel = labels.createAccount ?? "Create Account";

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
      <AnimationContainer className="max-w-sm space-y-8 text-center">
        <AnimationItem>
          <div className="relative mb-4 inline-block">
            <div className="absolute -inset-4 rounded-full bg-red-500/10 blur-3xl" />
            <h1 className="text-content relative text-5xl font-black tracking-tighter italic select-none sm:text-6xl">
              {title} <span className="text-primary">{highlight}</span>
            </h1>
          </div>
          <p className="text-content/80 mt-4 text-lg leading-relaxed font-medium opacity-50">
            {description}
          </p>
        </AnimationItem>

        <AnimationItem>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href={signInHref}
              variant="primary"
              size="lg"
              linkComponent={linkComponent}
              className="shadow-primary/20 w-full px-10 shadow-xl transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              {signInLabel}
            </Button>
            <Button
              href={signUpHref}
              variant="ghost"
              size="lg"
              linkComponent={linkComponent}
              className="hover:bg-content/5 w-full px-10 sm:w-auto"
            >
              {createAccountLabel}
            </Button>
          </div>
        </AnimationItem>
      </AnimationContainer>
    </div>
  );
};

export default AccessDenied;
