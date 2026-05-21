import { APP_ROUTES } from "@/constants/routes";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const CheckoutHeader = () => {
  const t = useTranslations("CheckoutPage.header");

  return (
    <div className="mb-8 md:mb-12">
      <Link
        href={APP_ROUTES.CART}
        className="group text-content/60 hover:text-primary mb-5 inline-flex items-center gap-2 text-sm font-medium transition-colors md:mb-6"
      >
        <ChevronLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
          aria-hidden
        />
        {t("backToCart")}
      </Link>
      <h1 className="text-content mb-4 text-3xl font-bold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <div className="bg-primary h-px w-24" />
    </div>
  );
};
