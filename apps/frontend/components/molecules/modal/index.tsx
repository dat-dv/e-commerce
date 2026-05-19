"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/atoms/button";
import { XIcon } from "@/components/atoms/icons";

export default function Modal({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Common.modal");
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [router]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-surface border border-content/10 shadow-2xl rounded-3xl p-8 relative animate-in zoom-in-95 slide-in-from-bottom-5"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="absolute right-6 top-6"
          aria-label={t("close")}
        >
          <XIcon />
        </Button>
        {children}
      </div>
    </div>
  );
}
