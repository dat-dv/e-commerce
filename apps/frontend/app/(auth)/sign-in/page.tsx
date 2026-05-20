import SignInForm from "@/components/molecules/sign-in-form";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("LoginPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SignInPage() {
  return <SignInForm />;
}
