"use client";

import { aseanCountries } from "@/constants/countries";
import { cn } from "@/utils/cn";

export function RegionSelectorView() {
  const handleSelect = (country: {
    code: string;
    language: string;
    disabled: boolean;
  }) => {
    if (!country.disabled) return;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl w-full rounded-3xl bg-surface p-8 shadow-2xl border border-content/5 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-content mb-2">
            Select Your Region
          </h1>
          <p className="text-content/60">
            Please select your country/region to continue. This will help us
            customize your experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {aseanCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleSelect(country)}
              disabled={country.disabled}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200",
                country.disabled
                  ? "border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 cursor-pointer"
                  : "border-content/5 bg-content/5 opacity-50 cursor-not-allowed",
              )}
            >
              <span className="text-2xl">{country.flag}</span>
              <div className="text-left">
                <p className="font-medium text-content">{country.name}</p>
                <p className="text-xs text-content/50">
                  {country.disabled ? "Available" : "Coming Soon"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
