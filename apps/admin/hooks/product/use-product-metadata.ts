"use client";

import { toast, useLoadOnce } from "@ecommerce/ui";
import { useCallback, useState, useTransition } from "react";

import { adminAttributeUseCase } from "@/domain/attribute";
import { adminBrandUseCase } from "@/domain/brand";
import { adminLanguageUseCase, type IAdminLanguage } from "@/domain/language";
import type {
  IAdminAttribute,
  IAdminBrand,
  IAdminCategory,
} from "@/domain/product";
import { adminProductCategoryUseCase } from "@/domain/product-category";

export const useProductMetadata = (enabled = true) => {
  const [brands, setBrands] = useState<IAdminBrand[]>([]);
  const [attributes, setAttributes] = useState<IAdminAttribute[]>([]);
  const [languages, setLanguages] = useState<IAdminLanguage[]>([]);
  const [categoryTree, setCategoryTree] = useState<IAdminCategory[]>([]);
  const [metadataLoading, startMetadataTransition] = useTransition();
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const loadMetadata = useCallback(() => {
    if (!enabled) return;

    setMetadataError(null);

    startMetadataTransition(async () => {
      const [
        brandsResult,
        categoriesResult,
        attributesResult,
        languagesResult,
      ] = await Promise.allSettled([
        adminBrandUseCase.getBrands.execute({ page: 1, limit: 50 }),
        adminProductCategoryUseCase.getCategoryTree.execute(),
        adminAttributeUseCase.getAttributes.execute(),
        adminLanguageUseCase.getLanguages.execute(),
      ]);

      const failedMessages: string[] = [];

      if (brandsResult.status === "fulfilled") {
        setBrands(brandsResult.value.items);
      } else {
        failedMessages.push("Failed to load brand options.");
      }

      if (categoriesResult.status === "fulfilled") {
        setCategoryTree(categoriesResult.value);
      } else {
        failedMessages.push("Failed to load category options.");
      }

      if (attributesResult.status === "fulfilled") {
        setAttributes(attributesResult.value);
      } else {
        failedMessages.push("Failed to load attribute options.");
      }

      if (languagesResult.status === "fulfilled") {
        setLanguages(languagesResult.value);
      } else {
        failedMessages.push("Failed to load language options.");
      }

      if (failedMessages.length > 0) {
        const nextError = failedMessages.join(" ");
        setMetadataError(nextError);
        toast.error(nextError);
      }
    });
  }, [enabled]);

  useLoadOnce(loadMetadata, enabled);

  return {
    brands,
    attributes,
    languages,
    categoryTree,
    metadataLoading,
    metadataError,
  };
};
