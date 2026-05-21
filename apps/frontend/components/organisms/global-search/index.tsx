"use client";

import AppContainer from "@/components/atoms/app-container";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import { TYPOGRAPHY } from "@/constants/typography";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/atoms/button";
import FormListenerDirty from "@/components/molecules/form/form-listener-dirty";
import { useSearchForm } from "./hooks/use-search-form";
import { SearchOption } from "./utils/search-routes";

interface SearchBarProps {
  options: SearchOption[];
  placeholder: string;
}

function SearchBar({ options, placeholder }: SearchBarProps) {
  const t = useTranslations("Common.search");

  return (
    <div className="group bg-surface border-content/[0.08] hover:border-content/[0.15] focus-within:border-content/[0.20] relative mx-auto flex w-full max-w-2xl items-center rounded-full border transition-all focus-within:shadow-sm">
      {/* Dropdown select */}
      <div className="border-content/[0.08] relative shrink-0 border-r pr-1 pl-3">
        <FormSelect
          name="route"
          options={options.map((opt) => ({
            label: opt.label,
            value: opt.router,
          }))}
          variant="none"
          size="sm"
          className={`w-24 font-bold tracking-wider uppercase ${TYPOGRAPHY.badge} text-content/60`}
          itemClassName={`px-3 py-2 ${TYPOGRAPHY.caption}`}
        />
      </div>

      {/* Search icon */}
      <div className="text-content/40 group-focus-within:text-primary pointer-events-none shrink-0 pr-1 pl-4 transition-colors">
        <Search size={16} />
      </div>

      {/* Form Input */}
      <div className="min-w-0 flex-1 pr-28">
        <FormInput
          name="search"
          variant="none"
          placeholder={placeholder}
          className={`!h-11 w-full bg-transparent ${TYPOGRAPHY.bodySmall} text-content placeholder:text-content/40 m-0 border-0 p-0 font-medium outline-none`}
        />
      </div>

      {/* Submit Button */}
      <FormListenerDirty>
        {() => (
          <Button
            type="submit"
            variant="ghost"
            className={`bg-content/[0.06] hover:bg-content/[0.12] text-content absolute top-1.5 right-1.5 bottom-1.5 rounded-full px-6 ${TYPOGRAPHY.caption} z-10 h-auto font-bold opacity-100 transition-all hover:opacity-100 active:scale-95 disabled:scale-95 disabled:opacity-0`}
          >
            {t("submit")}
          </Button>
        )}
      </FormListenerDirty>
    </div>
  );
}

export function GlobalSearch() {
  const { methods, onSubmit, options } = useSearchForm();

  const selectedRoute = methods.watch("route");
  const selectedOption =
    options.find((o) => o.router === selectedRoute) || options[0];
  const placeholder = selectedOption.placeholder;

  return (
    <div className="border-content/[0.04] bg-surface/80 hidden w-full border-t py-3 backdrop-blur-md md:block">
      <AppContainer>
        <AppForm methods={methods} onSubmit={onSubmit}>
          <SearchBar options={options} placeholder={placeholder} />
        </AppForm>
      </AppContainer>
    </div>
  );
}
