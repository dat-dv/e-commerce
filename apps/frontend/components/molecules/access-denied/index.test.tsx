import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AccessDenied from "./index";

// Mock Animation components as they might use motion which we mocked globally or want to simplify
vi.mock("@/components/atoms/animate", () => ({
  AnimationContainer: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  AnimationItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("AccessDenied Molecule", () => {
  it("should render the access denied message", () => {
    render(<AccessDenied />);
    expect(screen.getByText(/Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Denied/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You must be signed in to view this page/i),
    ).toBeInTheDocument();
  });

  it("should render Sign In and Create Account buttons", () => {
    render(<AccessDenied />);
    const signInButton = screen.getByRole("link", { name: /Sign In/i });
    const signUpButton = screen.getByRole("link", { name: /Create Account/i });

    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/sign-in");

    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/sign-up");
  });
});
