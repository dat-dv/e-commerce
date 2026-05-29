"use client";

import { Button } from "@ecommerce/ui";
import { AppForm } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
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

  useLockBodyScroll(isOpen);

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
            className="fixed inset-0 h-dvh w-screen max-w-full overflow-hidden bg-black/35 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className={cn(
              "border-content/10 bg-surface fixed right-0 bottom-0 left-0 z-100",
              "w-full max-w-full overflow-x-hidden",
              "max-h-[calc(100dvh-16px)] overflow-y-auto overscroll-contain",
              "rounded-t-3xl border p-4 shadow-2xl",
              "pb-[calc(1rem+env(safe-area-inset-bottom))]",
            )}
          >
            <div className="bg-content/15 mx-auto mb-4 h-1 w-10 rounded-full" />

            <div className="mb-4 flex max-w-full min-w-0 items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Search className="size-4" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-content truncate text-sm font-black">
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
                className="text-content/45 hover:bg-content/[0.05] hover:text-content size-9 shrink-0 rounded-full p-0"
                aria-label={t("clear")}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <AppForm methods={methods} onSubmit={handleSubmit}>
              <div className="mb-3 flex max-w-full gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1">
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
                        "h-9 max-w-[70vw] shrink-0 truncate rounded-full border px-3 text-xs font-black transition-colors",
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

              <div className="relative max-w-full min-w-0 overflow-hidden">
                <Search className="text-content/30 pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2" />

                <FormInput
                  name="search"
                  variant="outline"
                  size="lg"
                  placeholder={selectedOption.placeholder}
                  className="border-content/10 bg-content/[0.02] h-12 w-full min-w-0 rounded-full pr-24 pl-11 text-sm font-semibold"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="absolute top-1.5 right-1.5 h-9 shrink-0 rounded-full px-4 text-xs"
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
