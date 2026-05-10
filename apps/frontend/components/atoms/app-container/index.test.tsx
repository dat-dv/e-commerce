import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AppContainer from "./index";

describe("components/atoms/app-container: component checks", () => {
  // 1. Kiểm tra render children bình thường
  // 2. Kiểm tra các props mặc định: size='2xl' và center=true
  // 3. Kiểm tra truyền size option sinh ra đúng Tailwind class mapping
  // 4. Kiểm tra khi truyền center=false thì class 'mx-auto' biến mất
  // 5. Kiểm tra cho qua className custom
  // 6. Kiểm tra pass dán các attribute phụ (id, data-testid)

  it("renders children correctly", () => {
    render(
      <AppContainer>
        <span>Container Content</span>
      </AppContainer>,
    );
    expect(screen.getByText("Container Content")).toBeInTheDocument();
  });

  it('applies default classes (size="2xl", center=true)', () => {
    render(<AppContainer data-testid="app-container">Content</AppContainer>);
    const container = screen.getByTestId("app-container");

    expect(container).toHaveClass("w-full", "px-4", "sm:px-6", "lg:px-8");
    expect(container).toHaveClass("mx-auto");
    expect(container).toHaveClass("max-w-7xl");
  });

  it("applies the correct max-width class based on the size prop", () => {
    render(
      <AppContainer data-testid="app-container-sm" size="sm">
        Content
      </AppContainer>,
    );
    expect(screen.getByTestId("app-container-sm")).toHaveClass("max-w-xl");
  });

  it("does not apply mx-auto class when center prop is false", () => {
    render(
      <AppContainer data-testid="app-container-no-center" center={false}>
        Content
      </AppContainer>,
    );
    expect(screen.getByTestId("app-container-no-center")).not.toHaveClass(
      "mx-auto",
    );
  });

  it("appends custom className properly", () => {
    render(
      <AppContainer
        data-testid="app-container-custom"
        className="my-custom-layout"
      >
        Content
      </AppContainer>,
    );
    expect(screen.getByTestId("app-container-custom")).toHaveClass(
      "my-custom-layout",
    );
  });

  it("passes HTML attributes cleanly", () => {
    render(
      <AppContainer data-testid="app-container-attr" id="main-container">
        Content
      </AppContainer>,
    );
    expect(screen.getByTestId("app-container-attr")).toHaveAttribute(
      "id",
      "main-container",
    );
  });
});
