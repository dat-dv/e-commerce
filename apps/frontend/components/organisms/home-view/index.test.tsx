import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/hooks/auth/use-auth-store";

vi.mock("@/hooks/auth/use-auth-store", () => ({
  useAuthStore: vi.fn(),
}));

import { IAuthStore } from "@/store/user-store/user-store.type";

import { HomeView } from "./index";

describe("HomeView Organism", () => {
  vi.mock("@/hooks/config/use-config", () => ({
    useConfig: vi.fn().mockReturnValue({
      config: { siteName: "Zustand Todo", siteDescription: "Premium Todo App" },
    }),
  }));

  vi.mock("@/hooks/config/use-config-store", () => ({
    useAppConfig: vi.fn((selector) =>
      selector({
        theme: "light",
        isDarkMode: false,
        config: {
          siteName: "Zustand Todo",
          siteDescription: "Premium Todo App",
        },
      }),
    ),
  }));

  const mockAuthStore: IAuthStore = {
    user: null,
    setUser: vi.fn(),
    loading: false,
    _hasHydrated: false,
    setLoading: vi.fn(),
    setHasHydrated: vi.fn(),
    logout: vi.fn(),
  };
  const mockAuthStoreWithUser: IAuthStore = {
    user: { id: "1" },
    setUser: vi.fn(),
    loading: false,
    _hasHydrated: false,
    setLoading: vi.fn(),
    setHasHydrated: vi.fn(),
    logout: vi.fn(),
  };

  it("should render HomepagePublic when user is not logged in", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector(mockAuthStore),
    );

    render(<HomeView />);
    expect(screen.getByTestId("public-home")).toBeInTheDocument();
    expect(screen.queryByTestId("private-home")).not.toBeInTheDocument();
  });

  it("should render HomepagePrivate when user is logged in", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector(mockAuthStoreWithUser),
    );

    render(<HomeView />);
    expect(screen.getByTestId("private-home")).toBeInTheDocument();
    expect(screen.queryByTestId("public-home")).not.toBeInTheDocument();
  });
});
