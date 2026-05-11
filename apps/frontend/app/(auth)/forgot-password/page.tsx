import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/molecules/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Enter your email to receive a reset password link.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center">
      <ForgotPasswordForm />
    </div>
  );
}
