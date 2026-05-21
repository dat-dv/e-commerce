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
      className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors"
    >
      <LiquidWaveText inactiveClassName="text-primary/75">
        {t("viewAll")}
      </LiquidWaveText>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
};
