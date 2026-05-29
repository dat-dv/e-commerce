import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as Icons from "./index";

describe("Icons Components", () => {
  it("should render all icons correctly", () => {
    Object.values(Icons).forEach((IconComponent) => {
      const { container } = render(<IconComponent />);
      // Icons usually render as <svg>
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });
});
