import ResetPasswordForm from "@/components/molecules/reset-password-form";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ResetPasswordPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
