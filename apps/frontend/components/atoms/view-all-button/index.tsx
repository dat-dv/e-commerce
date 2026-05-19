"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface ViewAllButtonProps {
  href: string;
}

export const ViewAllButton = ({ href }: ViewAllButtonProps) => {
  const t = useTranslations("Common");

  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
    >
      {t("viewAll")}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
};
