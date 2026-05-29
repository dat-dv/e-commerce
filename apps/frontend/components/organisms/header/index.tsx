"use client";

import { RenderDesktopOnly, RenderTabletAndBelow } from "@ecommerce/ui";
import HeaderDesktop from "./header-desktop";
import HeaderTabletAndBellow from "./header-tablet";

export default function Header() {
  return (
    <>
      <RenderDesktopOnly>
        <HeaderDesktop />
      </RenderDesktopOnly>
      <RenderTabletAndBelow>
        <HeaderTabletAndBellow />
      </RenderTabletAndBelow>
    </>
  );
}
