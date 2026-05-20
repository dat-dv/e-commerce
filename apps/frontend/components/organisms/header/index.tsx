"use client";

import { DesktopRenderOnly, RenderOnMobile } from "../../molecules/responsive";
import HeaderDesktop from "./header-desktop";
import HeaderMobile from "./header-mobile/mobile";

export default function Header() {
  return (
    <>
      <DesktopRenderOnly>
        <HeaderDesktop />
      </DesktopRenderOnly>
      <RenderOnMobile>
        <HeaderMobile />
      </RenderOnMobile>
    </>
  );
}
