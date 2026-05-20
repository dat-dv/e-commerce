"use client";

import HeaderDesktop from "./desktop";
import HeaderMobile from "./mobile/mobile";

/**
 * Header acts as a responsive switcher for the application's navigation header.
 * Automatically displays HeaderDesktop on large viewports and HeaderMobile on small screens.
 */
export default function Header() {
  return (
    <>
      <div className="hidden md:block">
        <HeaderDesktop />
      </div>
      <div className="block md:hidden">
        <HeaderMobile />
      </div>
    </>
  );
}
