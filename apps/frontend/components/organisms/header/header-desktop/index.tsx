"use client";
import { AppContainer, Button, SettingsIcon } from "@ecommerce/ui";

import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

import { CategoryMegaMenuContentWrapper } from "@/components/molecules/categories-dropdown";

import { RenderDesktopOnly } from "@/components/molecules/responsive";
import { useHeaderStore } from "@/hooks/config/use-header-store";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useCallback, useRef } from "react";
import { GlobalSearch } from "../../global-search";
import HeaderActions from "../header-actions";
import HeaderLogo from "./header-logo";
import HeaderNav from "./header-nav";

export default function HeaderDesktop() {
  const { setIsOpenCategory, isOpenCategory } = useHeaderStore();
  const headerRef = useRef<HTMLElement>(null);
  const t = useTranslations("Common.header");
  const pathname = usePathname();
  const isSettingsActive = pathname === APP_ROUTES.SETTINGS;

  const handleCloseDrawer = useCallback(() => {
    if (isOpenCategory) setIsOpenCategory(false);
  }, [isOpenCategory, setIsOpenCategory]);

  useClickOutside(headerRef, handleCloseDrawer, isOpenCategory);

  return (
    <header
      ref={headerRef}
      className="border-content/10 bg-surface sticky top-0 z-50 flex w-full flex-col border-b"
    >
      <AppContainer className="relative z-20 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-10">
          <HeaderLogo />
          <HeaderNav />
        </div>

        <div className="flex items-center gap-0">
          <HeaderActions />
          <div className="bg-content/10 mx-2 h-6 w-px" />
          <Button
            variant="ghost"
            href={APP_ROUTES.SETTINGS}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full p-0 transition-colors",
              isSettingsActive
                ? "bg-primary/10 text-primary"
                : "text-content/60 hover:text-content hover:bg-content/5",
            )}
            title={t("settings")}
            aria-label={t("settings")}
          >
            <SettingsIcon isActive={isSettingsActive} />
          </Button>
        </div>
      </AppContainer>
      <CategoryMegaMenuContentWrapper />
      <RenderDesktopOnly isFallbackChildren={true}>
        <GlobalSearch />
      </RenderDesktopOnly>
    </header>
  );
}
