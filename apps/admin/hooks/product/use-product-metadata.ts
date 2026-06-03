"use client";

import type { ILanguageListResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { useCallback, useState } from "react";

import { adminAttributeUseCase } from "@/domain/attribute";
import { adminBrandUseCase } from "@/domain/brand";
import { adminLanguageUseCase } from "@/domain/language";
import {
  AdminProductMapper,
  type IAdminAttribute,
  type IAdminBrand,
  type IAdminCategory,
} from "@/domain/product";
import { adminProductCategoryUseCase } from "@/domain/product-category";

export const useProductMetadata = (enabled = true) => {
  const [brands, setBrands] = useState<IAdminBrand[]>([]);
  const [attributes, setAttributes] = useState<IAdminAttribute[]>([]);
  const [languages, setLanguages] = useState<ILanguageListResponse>([]);
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
      setBrands(
        brandsResult.value.data?.items.map((brand) =>
          AdminProductMapper.brandToDomain(brand),
        ) ?? [],
      );
    } else {
      console.error(brandsResult.reason);
      setMetadataError("Failed to load brand options.");
    }

    if (categoriesResult.status === "fulfilled") {
      setCategoryTree(
        AdminProductMapper.categoryTreeToDomain(
          categoriesResult.value.data ?? [],
        ),
      );
    } else {
      console.error(categoriesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load category options.`
          : "Failed to load category options.",
      );
    }

    if (attributesResult.status === "fulfilled") {
      setAttributes(
        AdminProductMapper.attributeListToDomain(
          attributesResult.value.data ?? [],
        ),
      );
    } else {
      console.error(attributesResult.reason);
      setMetadataError((current) =>
        current
          ? `${current} Failed to load attribute options.`
          : "Failed to load attribute options.",
      );
    }

    if (languagesResult.status === "fulfilled") {
      setLanguages(languagesResult.value.data ?? []);
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
