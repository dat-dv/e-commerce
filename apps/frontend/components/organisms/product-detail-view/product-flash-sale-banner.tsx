"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

interface ProductFlashSaleBannerProps {
  endTime?: string;
  soldCount?: number;
  totalStock?: number;
}

export function ProductFlashSaleBanner({
  endTime,
  soldCount = 0,
  totalStock = 0,
}: ProductFlashSaleBannerProps) {
  const t = useTranslations("AdminFlashSalesPage.detail");
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      if (difference <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const pad = (num: number) => String(num).padStart(2, "0");
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const progress = useMemo(() => {
    if (!totalStock) return 0;
    return Math.min(100, Math.round((soldCount / totalStock) * 100));
  }, [soldCount, totalStock]);

  const stockLeft = Math.max(0, totalStock - soldCount);

  return (
    <div
      className={cn(
        UI_RADIUS.card,
        "flex flex-col items-center justify-between gap-4 border border-red-500/20 bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white shadow-lg shadow-red-500/10 backdrop-blur-md md:flex-row",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="animate-pulse rounded-full bg-white/20 px-3 py-1 text-xs font-black tracking-wider uppercase">
          {t("flashSaleTitle")}
        </div>
        {endTime && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/80">
              {t("endsIn")}:
            </span>
            <span className="rounded bg-black/20 px-2 py-0.5 font-mono text-base font-black tracking-widest">
              {timeLeft}
            </span>
          </div>
        )}
      </div>

      {totalStock > 0 && (
        <div className="flex w-full min-w-[200px] shrink-0 items-center gap-3 md:w-auto">
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span>{t("soldCount", { sold: String(soldCount) })}</span>
              <span>{t("stockLeft", { left: String(stockLeft) })}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
