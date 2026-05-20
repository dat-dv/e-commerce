import ForgotPasswordForm from "@/components/molecules/forgot-password-form";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ForgotPasswordPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
