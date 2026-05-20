"use client";

import AppContainer from "@/components/atoms/app-container";
import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Menu, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import HeaderActions from "../desktop/header-actions";
import HeaderLogo from "../desktop/header-logo";
import MobileNavDrawer from "./mobile-nav-drawer";

/**
 * HeaderMobile represents the navigation header layout tailored for mobile devices.
 * Uses a hamburger menu to toggle a full-screen drawer overlay.
 */
export default function HeaderMobile() {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const t = useTranslations("Common.header");

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-content/10 bg-surface">
      <AppContainer className="flex h-16 items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu Trigger for Mobile Devices */}
          <button
            onClick={() => setIsOpenMobileMenu(true)}
            className="p-2 -ml-2 text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <HeaderLogo />
        </div>

        <div className="flex items-center gap-0">
          <HeaderActions />

          <div className="h-6 w-px bg-content/10 mx-2" />

          <Link
            href={APP_ROUTES.SETTINGS}
            className="w-10 h-10 flex items-center justify-center text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors"
            title={t("settings")}
          >
            <Settings size={20} />
          </Link>
        </div>
      </AppContainer>
      <MobileNavDrawer
        isOpen={isOpenMobileMenu}
        onClose={() => setIsOpenMobileMenu(false)}
      />
    </header>
  );
}
