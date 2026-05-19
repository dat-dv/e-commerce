import { getTranslations } from "next-intl/server";
import ResetPasswordForm from "@/components/molecules/reset-password-form";

export async function generateMetadata() {
  const t = await getTranslations("ResetPasswordPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center">
      <ResetPasswordForm />
    </div>
  );
}
