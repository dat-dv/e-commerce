import { type Metadata } from "next";

import { ForgotPasswordView } from "@/components/organisms/forgot-password-view";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Chốt Đơn admin account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView signInHref={APP_ROUTES.SIGN_IN} />;
}
