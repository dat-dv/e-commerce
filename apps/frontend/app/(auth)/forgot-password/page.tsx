import { getTranslations } from "next-intl/server";
import ForgotPasswordForm from "@/components/molecules/forgot-password-form";

export async function generateMetadata() {
  const t = await getTranslations("ForgotPasswordPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center">
      <ForgotPasswordForm />
    </div>
  );
}
