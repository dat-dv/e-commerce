"use client";

import { RefreshCcw, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Common.errorPage");

  return (
    <div className="bg-surface selection:bg-primary/30 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Red/Danger Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 opacity-40 blur-[140px]" />

      <div className="animate-in zoom-in fade-in relative z-10 flex max-w-lg flex-col items-center text-center duration-700">
        <div className="mb-8 rounded-[32px] border border-red-500/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="mb-4 text-4xl font-black tracking-tighter text-red-500">
          {t("title")}
        </h1>
        <p className="text-content/70 mb-10 max-w-md text-lg leading-relaxed font-medium">
          {t("description")}
        </p>

        <div className="bg-surface/40 border-content/5 mb-10 w-full rounded-[24px] border p-6 backdrop-blur-2xl">
          <p className="overflow-auto text-left font-mono text-xs break-all opacity-50">
            ERROR_ID: {error.digest || "UNKNOWN"}
            <br />
            MSG: {error.message || "Service Unavailable"}
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="lg"
            className="bg-primary shadow-primary/25 flex-1 rounded-[24px] border-none shadow-xl"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            {t("tryAgain")}
          </Button>
          <Button
            href={APP_ROUTES.HOME}
            variant="ghost"
            size="lg"
            className="flex-1 rounded-[24px] font-bold"
          >
            {t("takeMeBack")}
          </Button>
        </div>
      </div>
    </div>
  );
}
