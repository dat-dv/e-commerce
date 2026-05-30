import { RenderDesktopOnly, RenderTabletAndBelow } from "@ecommerce/ui";
import HeaderDesktop from "./header-desktop";
import HeaderTabletAndBellow from "./header-tablet";

export default function Header() {
  return (
    <>
      <RenderDesktopOnly fallbackClassName="sticky top-0 z-50">
        <HeaderDesktop />
      </RenderDesktopOnly>
      <RenderTabletAndBelow fallbackClassName="sticky top-0 z-50">
        <HeaderTabletAndBellow />
      </RenderTabletAndBelow>
    </>
  );
}
