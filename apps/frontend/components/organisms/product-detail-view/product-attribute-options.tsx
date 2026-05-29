"use client";

import { Button } from "@ecommerce/ui";
import { Check } from "lucide-react";

interface ProductAttributeOptionsProps {
  attributeGroups: Record<string, Set<string>>;
  selectedAttributes: Record<string, string>;
  onSelectedAttributesChange: (attrs: Record<string, string>) => void;
}

export function ProductAttributeOptions({
  attributeGroups,
  selectedAttributes,
  onSelectedAttributesChange,
}: ProductAttributeOptionsProps) {
  const parsedAttributeGroups = Object.entries(attributeGroups).map(
    ([name, valuesSet]) => ({
      name,
      values: Array.from(valuesSet),
    }),
  );

  return (
    <>
      {parsedAttributeGroups.map(({ name: attrName, values }) => (
        <div key={attrName} className="flex flex-col gap-3">
          <span className="text-content/60 w-24 text-sm font-medium">
            {attrName}
          </span>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedAttributes[attrName] === value;

              return (
                <Button
                  key={value}
                  variant="ghost"
                  onPress={() =>
                    onSelectedAttributesChange({
                      ...selectedAttributes,
                      [attrName]: value,
                    })
                  }
                  className={`flex h-auto items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:opacity-100 active:scale-[0.98] ${
                    isSelected
                      ? "border-primary text-primary bg-primary/5 hover:bg-primary/5"
                      : "border-content/[0.1] hover:border-content/20 text-content/80 hover:bg-transparent"
                  }`}
                >
                  {value}
                  {isSelected && <Check className="h-3 w-3" />}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
