"use client";

import {
  RenderDesktopOnly,
  RenderTabletAndBelow,
} from "../../molecules/responsive";
import HeaderDesktop from "./header-desktop";
import HeaderMobile from "./header-mobile/mobile";

export default function Header() {
  return (
    <>
      <RenderDesktopOnly>
        <HeaderDesktop />
      </RenderDesktopOnly>
      <RenderTabletAndBelow>
        <HeaderMobile />
      </RenderTabletAndBelow>
    </>
  );
}
