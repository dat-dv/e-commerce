"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ViewAllButton } from "@/components/atoms/view-all-button";
import { Timer } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  countdown?: Date;
  lang?: string;
}

export const SectionHeader = ({
  title,
  href,
  icon,
  lang = "vi",
  children,
  countdown,
}: SectionHeaderProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    h: string;
    m: string;
    s: string;
  } | null>(null);

  useEffect(() => {
    if (!countdown) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdown.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }

      const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        h: h.toString().padStart(2, "0"),
        m: m.toString().padStart(2, "0"),
        s: s.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {href ? (
            <Link href={href} className="w-fit">
              <h2 className="text-xl font-bold text-content flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                {icon}
                {title}
              </h2>
            </Link>
          ) : (
            <h2 className="text-xl font-bold text-content flex items-center gap-2">
              {icon}
              {title}
            </h2>
          )}
        </div>

        {/* Real Countdown Timer */}
        {timeLeft && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg shadow-sm">
            <Timer className="w-4 h-4 text-red-500" />
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-red-500">
              <span>{timeLeft.h}</span>
              <span className="animate-pulse">:</span>
              <span>{timeLeft.m}</span>
              <span className="animate-pulse">:</span>
              <span>{timeLeft.s}</span>
            </div>
          </div>
        )}

        {children}
      </div>

      {href && <ViewAllButton href={href} lang={lang} />}
    </div>
  );
};
