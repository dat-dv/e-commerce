"use client";

import HeaderDesktop from "./header-desktop";
import HeaderTabletAndBellow from "./header-tablet";

export default function Header() {
  return (
    <>
      <div className="sticky top-0 z-50 hidden lg:block">
        <HeaderDesktop />
      </div>
      <div className="sticky top-0 z-50 lg:hidden">
        <HeaderTabletAndBellow />
      </div>
    </>
  );
}
