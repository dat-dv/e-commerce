"use client";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  Smartphone,
  Laptop,
  Headphones,
  MonitorSmartphone,
} from "lucide-react";

export function TopBrandsHeader() {
  return (
    <AnimatedPageHeader
      title="Top"
      highlight="Brands"
      description="Explore the world's most iconic technology and design leaders."
      icons={[Smartphone, Laptop, Headphones, MonitorSmartphone]}
    />
  );
}

export default TopBrandsHeader;
