"use client";

import React, { useEffect } from "react";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { APP_ROUTES } from "@/constants/routes";
import { useHeaderStore } from "@/hooks/config/use-header-store";
import { AppContainer } from "@ecommerce/ui";
import { usePathname } from "next/navigation";
import SubCategoryItem from "./sub-category-item";
import { ParentCategoryItem } from "./parent-category-item";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const CategoryMegaMenuContent = () => {
  const t = useTranslations("Common.header.nav");
  const router = useRouter();
  const categories = useCategoriesStore((s) => s.categories);
  const {
    activeCategoryId,
    setActiveCategoryId,
    isOpenCategory,
    setIsOpenCategory,
  } = useHeaderStore();

  React.useEffect(() => {
    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [activeCategoryId, categories, setActiveCategoryId, isOpenCategory]);

  const allChildrenCategories = categories.find(
    (c) => c.id === activeCategoryId,
  )?.children;
  const currentCategory = categories.find((cat) => cat.id === activeCategoryId);

  const tabsRef = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (activeCategoryId && tabsRef.current.has(activeCategoryId)) {
      const activeTab = tabsRef.current.get(activeCategoryId);
      activeTab?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategoryId]);

  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col py-8">
      {/* 1. 2-Row Horizontal Grid Navigation */}
      <div className="border-content/10 hide-scrollbar mb-8 grid shrink-0 grid-flow-col grid-rows-2 gap-x-10 gap-y-4 overflow-x-auto scroll-smooth border-b pb-6">
        {/* All Categories */}
        <ParentCategoryItem
          name={t("allCategories")}
          onClick={() => {
            setIsOpenCategory(false);
            router.push(APP_ROUTES.CATEGORIES);
          }}
          active={false}
          refCallback={(el) => {
            if (el) tabsRef.current.set("all", el);
            else tabsRef.current.delete("all");
          }}
        />

        {categories.map((cat) => {
          const isParentOfActive = cat.children?.some(
            (child) => pathname === APP_ROUTES.CATEGORY_DETAIL(child.slug),
          );

          const isTabActive = activeCategoryId === cat.id;

          return (
            <ParentCategoryItem
              key={cat.id}
              name={cat.name}
              active={isTabActive}
              highlighted={isParentOfActive}
              onClick={() => setActiveCategoryId(cat.id)}
              refCallback={(el) => {
                if (el) tabsRef.current.set(cat.id, el);
                else tabsRef.current.delete(cat.id);
              }}
            />
          );
        })}
      </div>

      {/* 2. Subcategories List */}
      <div className="flex-1">
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          <SubCategoryItem
            name={`All ${currentCategory?.name || ""}`}
            href={APP_ROUTES.CATEGORY_DETAIL(currentCategory?.slug || "")}
            isActive={
              pathname ===
              APP_ROUTES.CATEGORY_DETAIL(currentCategory?.slug || "")
            }
            className="capitalize"
          />
          {allChildrenCategories?.map((cat) => {
            const isActive = pathname === APP_ROUTES.CATEGORY_DETAIL(cat.slug);
            return (
              <SubCategoryItem
                key={cat.id}
                name={cat.name}
                href={APP_ROUTES.CATEGORY_DETAIL(cat.slug)}
                isActive={isActive}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CategoryMegaMenuContentWrapper = () => {
  const isOpenCategory = useHeaderStore((s) => s.isOpenCategory);

  React.useEffect(() => {
    if (isOpenCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpenCategory]);

  if (!isOpenCategory) return null;

  return (
    <div className="bg-surface border-content/10 fixed top-16 left-0 z-50 w-full overflow-hidden border-b shadow-2xl">
      <AppContainer>
        <CategoryMegaMenuContent />
      </AppContainer>
    </div>
  );
};
