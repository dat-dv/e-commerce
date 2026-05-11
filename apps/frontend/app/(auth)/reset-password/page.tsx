import type { Metadata } from "next";
import ResetPasswordForm from "@/components/molecules/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your new password to access your account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center">
      <ResetPasswordForm />
    </div>
  );
}
