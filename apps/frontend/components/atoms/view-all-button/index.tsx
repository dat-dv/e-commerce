"use client";

import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
      <LiquidWaveText inactiveClassName="text-primary/75">
        {t("viewAll")}
      </LiquidWaveText>
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
};
