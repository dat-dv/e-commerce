"use client";
import AppContainer from "@/components/atoms/app-container";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

import HeaderActions from "./header-actions";
import HeaderLogo from "./header-logo";
import HeaderNav from "./header-nav";
import { Settings } from "lucide-react";
import { GlobalSearch } from "@/components/organisms/global-search";
import { CategoryMegaMenuContentWrapper } from "../categories-dropdown";

import { useClickOutside } from "@/hooks/ui/use-click-outside";
import { useHeaderStore } from "@/hooks/config/use-header-store";
import { useRef } from "react";

export default function Header() {
  const { setIsOpenCategory, isOpenCategory } = useHeaderStore();
  const headerRef = useRef<HTMLElement>(null);

  useClickOutside(
    headerRef,
    () => {
      if (isOpenCategory) setIsOpenCategory(false);
    },
    isOpenCategory,
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full flex flex-col border-b border-content/10 bg-surface"
    >
      <AppContainer className="flex h-16 items-center justify-between relative z-20">
        <div className="flex items-center gap-4 md:gap-10">
          <HeaderLogo />
          <HeaderNav />
        </div>

        <div className="flex items-center gap-0">
          <HeaderActions />

          <div className="h-6 w-px bg-content/10 mx-2" />

          <Link
            href={APP_ROUTES.SETTINGS}
            className="w-10 h-10 flex items-center justify-center text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </Link>
        </div>
      </AppContainer>
      <CategoryMegaMenuContentWrapper />
      <GlobalSearch />
    </header>
  );
}
