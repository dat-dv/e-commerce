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
    <div className="relative w-full max-w-2xl mx-auto flex items-center group bg-surface border border-content/[0.08] hover:border-content/[0.15] focus-within:border-content/[0.20] rounded-full transition-all focus-within:shadow-sm">
      {/* Dropdown select */}
      <div className="relative border-r border-content/[0.08] shrink-0 pl-3 pr-1">
        <FormSelect
          name="route"
          options={options.map((opt) => ({
            label: opt.label,
            value: opt.router,
          }))}
          variant="none"
          size="sm"
          className={`w-24 font-bold uppercase tracking-wider ${TYPOGRAPHY.badge} text-content/60`}
          itemClassName={`px-3 py-2 ${TYPOGRAPHY.caption}`}
        />
      </div>

      {/* Search icon */}
      <div className="pl-4 pr-1 text-content/40 group-focus-within:text-primary transition-colors shrink-0 pointer-events-none">
        <Search size={16} />
      </div>

      {/* Form Input */}
      <div className="flex-1 min-w-0 pr-28">
        <FormInput
          name="search"
          variant="none"
          placeholder={placeholder}
          className={`w-full !h-11 bg-transparent ${TYPOGRAPHY.bodySmall} outline-none text-content placeholder:text-content/40 font-medium m-0 border-0 p-0`}
        />
      </div>

      {/* Submit Button */}
      <FormListenerDirty>
        {() => (
          <Button
            type="submit"
            variant="ghost"
            className={`absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-content/[0.06] hover:bg-content/[0.12] text-content rounded-full ${TYPOGRAPHY.caption} font-bold disabled:opacity-0 disabled:scale-95 transition-all z-10 h-auto active:scale-95 opacity-100 hover:opacity-100`}
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
    <div className="w-full border-t border-content/[0.04] bg-surface/80 backdrop-blur-md py-3 hidden md:block">
      <AppContainer>
        <AppForm methods={methods} onSubmit={onSubmit}>
          <SearchBar options={options} placeholder={placeholder} />
        </AppForm>
      </AppContainer>
    </div>
  );
}
