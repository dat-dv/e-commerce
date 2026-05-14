"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { APP_ROUTES } from "@/constants/routes";
import { useHeaderStore } from "@/hooks/config/use-header-store";
import AppContainer from "@/components/atoms/app-container";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";

const SubCategory = ({
  name,
  href,
  isActive,
  className,
}: {
  name: string;
  href: string;
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "min-w-fit px-4 py-1.5 rounded-full border font-bold transition-all text-[12px]",
        isActive
          ? "border-primary text-primary bg-primary/5"
          : "border-content/10 text-content/80 hover:text-primary hover:border-primary/30 hover:bg-primary/5",
        className,
      )}
    >
      {name}
    </Link>
  );
};

const CategoryMegaMenuContent = () => {
  const categories = useCategoriesStore((s) => s.categories);
  const { activeCategoryId, setActiveCategoryId, isOpenCategory } =
    useHeaderStore();

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
    <div className="w-full py-8 flex flex-col">
      {/* 1. 2-Row Horizontal Grid Navigation */}
      <div className="grid grid-rows-2 grid-flow-col gap-x-10 gap-y-4 border-b border-content/10 pb-6 mb-10 overflow-x-auto hide-scrollbar shrink-0 scroll-smooth">
        {categories.map((cat) => {
          // Check if this parent category contains the current active subcategory
          const isParentOfActive = cat.children?.some(
            (child) => pathname === APP_ROUTES.CATEGORY_DETAIL(child.slug),
          );
          const isTabActive = activeCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              ref={(el) => {
                if (el) tabsRef.current.set(cat.id, el);
                else tabsRef.current.delete(cat.id);
              }}
              onClick={() => setActiveCategoryId(cat.id)}
              className={cn(
                "text-sm font-bold transition-all relative pb-2 capitalize whitespace-nowrap text-left",
                isTabActive
                  ? "text-primary"
                  : isParentOfActive
                    ? "text-content/90" // Stronger color if its child is active
                    : "text-content/60 hover:text-content/90",
              )}
            >
              {cat.name}
              {isTabActive && (
                <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-primary rounded-full shadow-[0_-2px_8px_rgba(var(--primary),0.4)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Subcategories List */}
      <div className="flex-1">
        <div className="flex gap-x-4 flex-wrap gap-y-3">
          <SubCategory
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
              <SubCategory
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
    <div className="fixed top-16 left-0 w-full bg-surface z-50 overflow-hidden shadow-2xl border-b border-content/10">
      <AppContainer>
        <CategoryMegaMenuContent />
      </AppContainer>
    </div>
  );
};
