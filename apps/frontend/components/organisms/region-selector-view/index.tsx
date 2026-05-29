"use client";

import { aseanCountries } from "@/constants/countries";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

import { Button } from "@ecommerce/ui";

export function RegionSelectorView() {
  const t = useTranslations("Common.regionSelector");

  const handleSelect = (country: {
    code: string;
    language: string;
    disabled: boolean;
  }) => {
    if (!country.disabled) return;
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-surface border-content/5 mx-auto w-full max-w-2xl rounded-3xl border p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-content mb-2 text-3xl font-bold">{t("title")}</h1>
          <p className="text-content/60">{t("description")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {aseanCountries.map((country) => (
            <Button
              key={country.code}
              variant="ghost"
              onClick={() => handleSelect(country)}
              disabled={country.disabled}
              className={cn(
                "flex h-auto items-center gap-3 rounded-2xl border p-4 text-left font-normal transition-all duration-200 hover:opacity-100 active:scale-[0.98]",
                country.disabled
                  ? "border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 cursor-pointer"
                  : "border-content/5 bg-content/5 hover:bg-content/5 cursor-not-allowed opacity-50",
              )}
            >
              <span className="text-2xl">{country.flag}</span>
              <div className="text-left">
                <p className="text-content font-medium">{country.name}</p>
                <p className="text-content/50 text-xs">
                  {country.disabled ? t("available") : t("comingSoon")}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
