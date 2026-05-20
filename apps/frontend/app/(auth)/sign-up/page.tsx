import SignUpForm from "@/components/molecules/sign-up-form";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("RegisterPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SignUpPage() {
  return <SignUpForm />;
}
