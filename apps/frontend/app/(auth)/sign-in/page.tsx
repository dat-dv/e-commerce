import { getTranslations } from "next-intl/server";
import SignInForm from "@/components/molecules/sign-in-form";

export async function generateMetadata() {
  const t = await getTranslations("LoginPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center">
      <SignInForm />
    </div>
  );
}
