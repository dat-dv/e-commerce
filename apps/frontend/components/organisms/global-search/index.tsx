"use client";

import AppForm from "@/components/molecules/form/app-form";

import { cn } from "@/utils/cn";
import { ComponentPropsWithoutRef } from "react";
import { useSearchForm } from "./hooks/use-search-form";
import SearchBar from "./search-bar";

export function GlobalSearch({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { methods, onSubmit, options } = useSearchForm();

  const selectedRoute = methods.watch("route");
  const selectedOption =
    options.find((o) => o.router === selectedRoute) || options[0];
  const placeholder = selectedOption.placeholder;

  return (
    <div
      className={cn(
        "border-content/[0.04] bg-surface/80 w-full border-t py-3 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <AppForm methods={methods} onSubmit={onSubmit}>
        <SearchBar options={options} placeholder={placeholder} />
      </AppForm>
    </div>
  );
}
