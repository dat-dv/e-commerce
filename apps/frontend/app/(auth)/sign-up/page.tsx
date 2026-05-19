import { getTranslations } from "next-intl/server";
import SignUpForm from "@/components/molecules/sign-up-form";

export async function generateMetadata() {
  const t = await getTranslations("RegisterPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SignUpForm />
    </div>
  );
}
