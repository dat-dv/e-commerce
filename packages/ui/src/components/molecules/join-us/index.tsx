"use client";

import Button from "@/components/atoms/button";
import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

export const JoinUs = () => {
  const t = useTranslations("HomePage.joinUs");

  return (
    <section className="border-content/[0.04] relative overflow-hidden border-y py-16 md:py-24">
      <div className="relative z-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-3xl">
          <h2 className="text-content text-4xl leading-none font-black tracking-[-0.06em] uppercase md:text-6xl">
            <LiquidWaveText>
              {t.rich("title", {
                br: () => <br />,
              })}
            </LiquidWaveText>
          </h2>

          <p className="text-content/50 mt-6 max-w-xl text-base leading-relaxed font-medium md:text-lg">
            <LiquidWaveText>{t("desc")}</LiquidWaveText>
          </p>
        </div>

        <div className="flex md:justify-end">
          <Button
            href={APP_ROUTES.SIGN_UP}
            variant="primary"
            size="lg"
            className="shadow-primary/20 rounded-xl px-8 text-sm font-bold shadow-xl"
          >
            {t("btnJoin")}
          </Button>
        </div>
      </div>

      <span className="text-content/[0.025] pointer-events-none absolute -right-8 bottom-0 text-[96px] leading-none font-black tracking-[-0.08em] uppercase select-none md:text-[160px]">
        {t("backgroundText")}
      </span>
    </section>
  );
};
