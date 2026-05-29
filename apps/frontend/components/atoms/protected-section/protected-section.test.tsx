import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProtectedSection from "./protected-section";

vi.mock("@/hooks/auth/use-auth-store", () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from "@/hooks/auth/use-auth-store";

describe("ProtectedSection Component", () => {
  it("should render children when user is authenticated (has userid)", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({ user: { id: "user-1" } } as never),
    );

    render(
      <ProtectedSection
        fallbackChildren={<div data-testid="fallback">Fallback Content</div>}
      >
        <div data-testid="protected">Protected Content</div>
      </ProtectedSection>,
    );

    expect(screen.getByTestId("protected")).toBeInTheDocument();
    expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();
  });

  it("should render fallbackChildren when user is not authenticated", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({ user: null } as never),
    );

    render(
      <ProtectedSection
        fallbackChildren={<div data-testid="fallback">Fallback Content</div>}
      >
        <div data-testid="protected">Protected Content</div>
      </ProtectedSection>,
    );

    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
  });
});
