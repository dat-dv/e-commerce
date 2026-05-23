"use client";

import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import HamburgerButton from "@/components/atoms/hamburger-button";
import { Search } from "lucide-react";
import { useState } from "react";

import { RenderTabletAndBelow } from "@/components/molecules/responsive";
import HeaderActions from "../header-actions";
import HeaderLogo from "../header-desktop/header-logo";
import MobileNavDrawer from "./tablet-nav-drawer";
import MobileSearchDrawer from "./tablet-search-drawer";

export default function HeaderTabletAndBellow() {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  return (
    <header className="border-content/10 bg-surface sticky top-0 z-50 flex w-full flex-col border-b">
      <AppContainer className="relative z-20 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <HeaderLogo />
        </div>
        <div className="flex items-center gap-0">
          <Button
            variant="ghost"
            onClick={() => setIsOpenSearch(true)}
            className="text-content/60 hover:bg-content/[0.05] hover:text-content flex size-10 items-center justify-center rounded-full p-0"
            aria-label="Open search"
          >
            <Search className="size-5" aria-hidden="true" />
          </Button>
          <HeaderActions
            visible={["avatar", "notifications", "cart", "fallback"]}
            classNames={{
              avatar: "hidden md:contents lg:hidden",
              fallback: "hidden md:contents lg:hidden",
            }}
          />
          <HamburgerButton
            isOpen={isOpenMobileMenu}
            onClick={() => setIsOpenMobileMenu(true)}
            ariaLabel="Open navigation menu"
            className="ml-1"
          />
        </div>
      </AppContainer>

      <RenderTabletAndBelow>
        <MobileNavDrawer
          isOpen={isOpenMobileMenu}
          onClose={() => setIsOpenMobileMenu(false)}
        />
        <MobileSearchDrawer
          isOpen={isOpenSearch}
          onClose={() => setIsOpenSearch(false)}
        />
      </RenderTabletAndBelow>
    </header>
  );
}
