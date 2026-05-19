"use client";

import AppContainer from "@/components/atoms/app-container";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import { APP_ROUTES } from "@/constants/routes";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import Button from "@/components/atoms/button";
import FormListenerDirty from "@/components/molecules/form/form-listener-dirty";

type SearchFormValues = {
  query: string;
};

export function GlobalSearch() {
  const t = useTranslations("Common.search");
  const searchParams = useSearchParams();
  const router = useRouter();

  const methods = useForm<SearchFormValues>({
    defaultValues: {
      query: searchParams.get("search") || "",
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    if (!data.query.trim()) return;
    router.push(
      `${APP_ROUTES.SEARCH}?search=${encodeURIComponent(data.query.trim())}`,
    );
  };

  return (
    <div className="w-full border-t border-content/[0.04] bg-surface/80 backdrop-blur-md py-3 hidden md:block">
      <AppContainer>
        <AppForm methods={methods} onSubmit={onSubmit}>
          <div className="relative w-full max-w-2xl mx-auto flex items-center group">
            <Search className="absolute left-4 w-4 h-4 text-content/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
            <FormInput
              name="query"
              variant="none"
              placeholder={t("globalPlaceholder")}
              className="w-full !h-12 bg-surface !border-solid border border-content/[0.08] hover:border-content/[0.15] focus:border-content/[0.25] focus:shadow-sm transition-all rounded-full pl-11 pr-28 text-sm outline-none text-content placeholder:text-content/40 font-medium m-0"
            />
            <FormListenerDirty>
              {() => (
                <Button
                  type="submit"
                  variant="ghost"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-content/[0.06] hover:bg-content/[0.12] text-content rounded-full text-xs font-bold disabled:opacity-0 disabled:scale-95 transition-all z-10 h-auto active:scale-95 opacity-100 hover:opacity-100"
                >
                  {t("submit")}
                </Button>
              )}
            </FormListenerDirty>
          </div>
        </AppForm>
      </AppContainer>
    </div>
  );
}
