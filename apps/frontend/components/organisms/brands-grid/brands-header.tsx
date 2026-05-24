"use client";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  Headphones,
  Laptop,
  MonitorSmartphone,
  Smartphone,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function BrandsHeader() {
  const t = useTranslations("BrandsPage.header");

  return (
    <AnimatedPageHeader
      center
      title={t("title")}
      highlight={t("highlight")}
      description={t("description")}
      icons={[Smartphone, Laptop, Headphones, MonitorSmartphone]}
    />
  );
}

export default BrandsHeader;
