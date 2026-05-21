"use client";

import HeaderDesktop from "./header-desktop";
import HeaderMobile from "./header-mobile/mobile";

export default function Header() {
  return (
    <div>
      <div className="hidden lg:block">
        <HeaderDesktop />
      </div>
      <div className="lg:hidden">
        <HeaderMobile />
      </div>
    </div>
  );
}
