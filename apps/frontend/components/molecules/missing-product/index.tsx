"use client";

import Button from "@/components/atoms/button";
import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MissingProduct() {
  const t = useTranslations("Common.missingProduct");
  const router = useRouter();

  const suggestedRoutes = [
    { label: t("browseProducts"), href: APP_ROUTES.PRODUCTS },
    { label: t("viewCart"), href: APP_ROUTES.CART },
    { label: t("backToHome"), href: APP_ROUTES.HOME },
  ];

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        {/* Minimal Icon Container */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          <Search className="text-content/60 mr-2 h-12 w-12" />

          <h1 className="text-content mb-2 text-2xl font-bold tracking-tight">
            {t("title")}
          </h1>
        </div>

        <p className="text-content/60 mx-auto mb-8 max-w-sm text-sm leading-relaxed">
          {t("description")}
        </p>

        {/* Clean Navigation Links (Vercel Style) */}
        <div className="mb-8 space-y-2">
          {suggestedRoutes.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-surface border-content/[0.05] hover:border-content/[0.1] group flex items-center justify-between rounded-lg border p-3.5 text-left transition-colors"
            >
              <span className="text-content/80 group-hover:text-content text-sm font-medium">
                {item.label}
              </span>
              <ChevronRight className="text-content/30 group-hover:text-content/60 h-4 w-4 transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            href={APP_ROUTES.PRODUCTS}
            variant="primary"
            size="md"
            className="flex-1"
          >
            {t("continueShopping")}
          </Button>
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="md"
            className="flex-1"
          >
            {t("goBack")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
