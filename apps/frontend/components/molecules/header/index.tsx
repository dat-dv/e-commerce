import AppContainer from "@/components/atoms/app-container";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

import HeaderActions from "./header-actions";
import HeaderLogo from "./header-logo";
import HeaderNav from "./header-nav";
import { Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[.08] bg-surface/80 backdrop-blur-md">
      <AppContainer className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
          <HeaderLogo />
          <HeaderNav />
        </div>

        <div className="flex items-center gap-0">
          <HeaderActions />

          <div className="h-6 w-px bg-black/[.08] dark:bg-white/[.08] mx-2" />

          <Link
            href={APP_ROUTES.SETTINGS}
            className="w-10 h-10 flex items-center justify-center text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </Link>
        </div>
      </AppContainer>
    </header>
  );
}
