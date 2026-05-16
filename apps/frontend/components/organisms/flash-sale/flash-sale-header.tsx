"use client";

import { Zap, Timer, Flame, Sparkles } from "lucide-react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";

export function FlashSaleHeader() {
  return (
    <AnimatedPageHeader
      title="Flash"
      highlight="Sale"
      description="High-performance technology at unprecedented prices. Synchronize your watches."
      icons={[Zap, Timer, Flame, Sparkles]}
    />
  );
}

export default FlashSaleHeader;
