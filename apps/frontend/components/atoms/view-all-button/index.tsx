"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ViewAllButtonProps {
  href: string;
  lang?: string;
}

export const ViewAllButton = ({ href, lang = "vi" }: ViewAllButtonProps) => {
  const text = lang === "vi" ? "Xem tất cả" : "View All";

  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
    >
      {text}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
};
