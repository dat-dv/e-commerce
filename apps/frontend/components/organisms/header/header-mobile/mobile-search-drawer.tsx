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
            className="border-content/10 bg-surface fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border p-4 shadow-2xl"
          >
            <div className="bg-content/15 mx-auto mb-4 h-1 w-10 rounded-full" />

            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Search className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-content text-sm font-black">
                    {t("submit")}
                  </p>
                  <p className="text-content/45 truncate text-xs font-medium">
                    {selectedOption.placeholder}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={onClose}
                className="text-content/45 hover:bg-content/[0.05] hover:text-content size-9 rounded-full p-0"
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
                <Search className="text-content/30 pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2" />
                <FormInput
                  name="search"
                  variant="outline"
                  size="lg"
                  autoFocus
                  placeholder={selectedOption.placeholder}
                  className="border-content/10 bg-content/[0.02] h-12 rounded-full pr-24 pl-11 text-sm font-semibold"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="absolute top-1.5 right-1.5 h-9 rounded-full px-4 text-xs"
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
