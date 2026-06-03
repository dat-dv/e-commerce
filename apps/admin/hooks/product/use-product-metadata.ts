"use client";

import { useLoadOnce } from "@ecommerce/ui";
import { useCallback, useState } from "react";

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
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const loadMetadata = useCallback(async () => {
    if (!enabled) return;

    setMetadataLoading(true);
    setMetadataError(null);

    const [brandsResult, categoriesResult, attributesResult, languagesResult] =
      await Promise.allSettled([
        adminBrandUseCase.getBrands.execute({ page: 1, limit: 50 }),
        adminProductCategoryUseCase.getCategoryTree.execute(),
        adminAttributeUseCase.getAttributes.execute(),
        adminLanguageUseCase.getLanguages.execute(),
      ]);

    if (brandsResult.status === "fulfilled") {
      setBrands(brandsResult.value.items);
    } else {
      console.error(brandsResult.reason);
      setMetadataError("Failed to load brand options.");
    }

    if (categoriesResult.status === "fulfilled") {
      setCategoryTree(categoriesResult.value);
    } else {
      console.error(categoriesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load category options.`
          : "Failed to load category options.",
      );
    }

    if (attributesResult.status === "fulfilled") {
      setAttributes(attributesResult.value);
    } else {
      console.error(attributesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load attribute options.`
          : "Failed to load attribute options.",
      );
    }

    if (languagesResult.status === "fulfilled") {
      setLanguages(languagesResult.value);
    } else {
      console.error(languagesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load language options.`
          : "Failed to load language options.",
      );
    }

    setMetadataLoading(false);
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
