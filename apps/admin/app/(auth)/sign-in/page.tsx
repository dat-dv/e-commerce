import { type Metadata } from "next";

import { SignInView } from "@/components/organisms/sign-in-view";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Chốt Đơn admin dashboard.",
};

export default function SignInPage() {
  return <SignInView forgotPasswordHref="/forgot-password" />;
}
