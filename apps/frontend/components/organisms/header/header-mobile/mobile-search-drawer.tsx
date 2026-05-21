"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  SearchFormValues,
  useSearchForm,
} from "../../global-search/hooks/use-search-form";

interface IMobileSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearchDrawer({
  isOpen,
  onClose,
}: IMobileSearchDrawerProps) {
  const { methods, onSubmit, options } = useSearchForm();
  const t = useTranslations("Common.search");
  const selectedRoute = methods.watch("route");
  const selectedOption =
    options.find((option) => option.router === selectedRoute) || options[0];

  const handleSubmit = (values: SearchFormValues) => {
    onSubmit(values);

    if (values.search.trim()) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border border-content/10 bg-surface p-4 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-content/15" />

            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-content">
                    {t("submit")}
                  </p>
                  <p className="truncate text-xs font-medium text-content/45">
                    {selectedOption.placeholder}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={onClose}
                className="size-9 rounded-full p-0 text-content/45 hover:bg-content/[0.05] hover:text-content"
                aria-label={t("clear")}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <AppForm methods={methods} onSubmit={handleSubmit}>
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {options.map((option) => {
                  const isActive = selectedRoute === option.router;

                  return (
                    <button
                      key={option.router}
                      type="button"
                      onClick={() =>
                        methods.setValue("route", option.router, {
                          shouldDirty: true,
                        })
                      }
                      className={cn(
                        "h-9 shrink-0 rounded-full border px-3 text-xs font-black transition-colors",
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-content/10 text-content/55 hover:border-primary/25 hover:text-primary",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-content/30" />
                <FormInput
                  name="search"
                  variant="outline"
                  size="lg"
                  autoFocus
                  placeholder={selectedOption.placeholder}
                  className="h-12 rounded-full border-content/10 bg-content/[0.02] pl-11 pr-24 text-sm font-semibold"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="absolute right-1.5 top-1.5 h-9 rounded-full px-4 text-xs"
                >
                  {t("submit")}
                </Button>
              </div>
            </AppForm>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
