import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./index";

describe("Button Component", () => {
  it("should render correctly with text", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("should render as a Link when href is provided", () => {
    render(<Button href="/test-path">Navigate</Button>);
    const link = screen.getByRole("link", { name: /navigate/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test-path");
  });

  it("should trigger click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Action</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when loading prop is true", () => {
    render(<Button loading>Submitting</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // The spinner div doesn't have a role, but the button should be disabled
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Not Allowed</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
