"use client";

import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { Menu, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import HeaderActions from "../header-desktop/header-actions";
import HeaderLogo from "../header-desktop/header-logo";
import MobileNavDrawer from "./mobile-nav-drawer";

export default function HeaderMobile() {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const t = useTranslations("Common.header");

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-content/10 bg-surface">
      <AppContainer className="flex h-16 items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpenMobileMenu(true)}
            className="p-2 -ml-2 text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors flex items-center justify-center h-auto w-auto"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </Button>

          <HeaderLogo />
        </div>

        <div className="flex items-center gap-0">
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
        </div>
      </AppContainer>
      <MobileNavDrawer
        isOpen={isOpenMobileMenu}
        onClose={() => setIsOpenMobileMenu(false)}
      />
    </header>
  );
}
