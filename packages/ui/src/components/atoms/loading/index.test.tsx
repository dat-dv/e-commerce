import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Loading from "./index";

describe("Loading Component", () => {
  it("should render loading text correctly", () => {
    render(<Loading />);
    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeInTheDocument();
  });
});
