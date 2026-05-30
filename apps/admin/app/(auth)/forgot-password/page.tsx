import { type Metadata } from "next";

import { ForgotPasswordView } from "@/components/organisms/forgot-password-view";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Chốt Đơn admin account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView signInHref="/sign-in" />;
}
