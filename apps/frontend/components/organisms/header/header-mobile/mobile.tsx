"use client";

import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import HamburgerButton from "@/components/atoms/hamburger-button";
import { Search } from "lucide-react";
import { useState } from "react";

import {
  RenderMobileOnly,
  RenderTabletOnly,
} from "@/components/molecules/responsive";
import HeaderActions from "../header-actions";
import HeaderLogo from "../header-desktop/header-logo";
import MobileNavDrawer from "./mobile-nav-drawer";
import MobileSearchDrawer from "./mobile-search-drawer";

export default function HeaderMobile() {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-content/10 bg-surface">
      <AppContainer className="flex h-16 items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <HeaderLogo />
        </div>
        <div className="flex items-center gap-0">
          <Button
            variant="ghost"
            onClick={() => setIsOpenSearch(true)}
            className="flex size-10 items-center justify-center rounded-full p-0 text-content/60 hover:bg-content/[0.05] hover:text-content"
            aria-label="Open search"
          >
            <Search className="size-5" aria-hidden="true" />
          </Button>
          <RenderMobileOnly>
            <HeaderActions visible={["notifications", "cart"]} />
          </RenderMobileOnly>
          <RenderTabletOnly>
            <HeaderActions
              visible={["avatar", "notifications", "cart", "fallback"]}
            />
          </RenderTabletOnly>
          <HamburgerButton
            isOpen={isOpenMobileMenu}
            onClick={() => setIsOpenMobileMenu(true)}
            ariaLabel="Open navigation menu"
          />
        </div>
      </AppContainer>

      <MobileNavDrawer
        isOpen={isOpenMobileMenu}
        onClose={() => setIsOpenMobileMenu(false)}
      />
      <MobileSearchDrawer
        isOpen={isOpenSearch}
        onClose={() => setIsOpenSearch(false)}
      />
    </header>
  );
}
