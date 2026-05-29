import { render } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ScrollToTop from "./index";

vi.mock("@/config/blacklist-scroll-to-top.config", () => ({
  BLACK_LIST_SCROLL_TO_TOP: ["/blacklisted"],
}));

describe("ScrollToTop Component", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  it("should not call window.scrollTo on initial render", () => {
    vi.mocked(usePathname).mockReturnValue("/initial");
    render(<ScrollToTop />);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("should call window.scrollTo when pathname changes to an allowed path", () => {
    vi.mocked(usePathname).mockReturnValue("/initial");
    const { rerender } = render(<ScrollToTop />);
    vi.mocked(usePathname).mockReturnValue("/new-path");
    rerender(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("should not scroll when pathname changes to a blacklisted path", () => {
    vi.mocked(usePathname).mockReturnValue("/initial");
    const { rerender } = render(<ScrollToTop />);
    vi.mocked(usePathname).mockReturnValue("/blacklisted");
    rerender(<ScrollToTop />);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
