"use client";
import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

import { GlobalSearch } from "@/components/organisms/global-search";
import { Settings } from "lucide-react";
import { CategoryMegaMenuContentWrapper } from "../../../molecules/categories-dropdown";

import { RenderDesktopOnly } from "@/components/molecules/responsive";
import { useHeaderStore } from "@/hooks/config/use-header-store";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useRef } from "react";
import HeaderActions from "../header-actions";
import HeaderLogo from "./header-logo";
import HeaderNav from "./header-nav";

export default function HeaderDesktop() {
  const { setIsOpenCategory, isOpenCategory } = useHeaderStore();
  const headerRef = useRef<HTMLElement>(null);
  const t = useTranslations("Common.header");

  const handleCloseDrawer = useCallback(() => {
    if (isOpenCategory) setIsOpenCategory(false);
  }, [isOpenCategory, setIsOpenCategory]);

  useClickOutside(headerRef, handleCloseDrawer, isOpenCategory);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full flex flex-col border-b border-content/10 bg-surface"
    >
      <AppContainer className="flex h-16 items-center justify-between relative z-20">
        <div className="flex items-center gap-2 md:gap-10">
          <HeaderLogo />
          <HeaderNav />
        </div>

        <div className="flex items-center gap-0">
          <RenderDesktopOnly>
            <HeaderActions />
            <div className="h-6 w-px bg-content/10 mx-2" />
            <Button
              variant="ghost"
              href={APP_ROUTES.SETTINGS}
              className="w-10 h-10 flex items-center justify-center text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors p-0"
              title={t("settings")}
            >
              <Settings size={20} />
            </Button>
          </RenderDesktopOnly>
        </div>
      </AppContainer>
      <CategoryMegaMenuContentWrapper />
      <Suspense>
        <GlobalSearch />
      </Suspense>
    </header>
  );
}
