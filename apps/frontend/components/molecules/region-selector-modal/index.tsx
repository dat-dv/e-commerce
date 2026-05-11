"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { aseanCountries } from "@/constants/countries";

// Data moved to @/constants/countries

export default function RegionSelectorModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if region is already set
    const savedRegion = localStorage.getItem("user_region");

    if (!savedRegion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, []);

  const handleSelect = (code: string) => {
    localStorage.setItem("user_region", code);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-[99999]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-2xl w-full rounded-3xl bg-surface p-8 shadow-2xl border border-content/5 backdrop-blur-xl">
          <div className="text-center mb-8">
            <DialogTitle className="text-3xl font-bold text-content mb-2">
              Select Your Region
            </DialogTitle>
            <p className="text-content/60">
              Please select your country/region to continue. This will help us
              customize your experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {aseanCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => country.enabled && handleSelect(country.code)}
                disabled={!country.enabled}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200",
                  country.enabled
                    ? "border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 cursor-pointer"
                    : "border-content/5 bg-content/5 opacity-50 cursor-not-allowed",
                )}
              >
                <span className="text-2xl">{country.flag}</span>
                <div className="text-left">
                  <p className="font-medium text-content">{country.name}</p>
                  <p className="text-xs text-content/50">
                    {country.enabled ? "Available" : "Coming Soon"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-content/40">
            Currently, we only support Vietnam. Other regions will be available
            soon.
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
