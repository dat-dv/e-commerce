import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ETheme } from "@/constants/theme.constanst";
import { useConfig } from "@/hooks/config/use-config";

import ThemeSwitcher from "./index";

// Mock the hook and configuration
vi.mock("@/hooks/config/use-config", () => ({
  useConfig: vi.fn(),
}));

vi.mock("@/config/config", () => ({
  THEMES: [{ id: ETheme.BLUE, label: "Blue", color: "#3b82f6" }],
}));

describe("ThemeSwitcher Molecule", () => {
  it("should render theme selection buttons", () => {
    vi.mocked(useConfig).mockReturnValue({
      theme: ETheme.BLUE,
      isDarkMode: false,
      setTheme: vi.fn(),
      setDarkMode: vi.fn(),
      toggleDarkMode: vi.fn(),
    });

    render(<ThemeSwitcher />);

    // Check for theme dots (using title for identification as labeled in code)
    expect(screen.getByTitle("Blue")).toBeInTheDocument();
  });

  it("should call setTheme when a theme dot is clicked", () => {
    const setTheme = vi.fn();
    vi.mocked(useConfig).mockReturnValue({
      theme: ETheme.BLUE,
      isDarkMode: false,
      setTheme,
      setDarkMode: vi.fn(),
      toggleDarkMode: vi.fn(),
    });

    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByTitle("Blue"));
    expect(setTheme).toHaveBeenCalledWith(ETheme.BLUE);
  });

  it("should call toggleDarkMode when the sun/moon button is clicked", () => {
    const toggleDarkMode = vi.fn();
    vi.mocked(useConfig).mockReturnValue({
      theme: ETheme.BLUE,
      isDarkMode: true,
      setTheme: vi.fn(),
      setDarkMode: vi.fn(),
      toggleDarkMode,
    });

    render(<ThemeSwitcher />);

    // Find button with toggle action
    const toggleButton = screen.getAllByRole("button").pop();
    fireEvent.click(toggleButton!);
    expect(toggleDarkMode).toHaveBeenCalled();
  });
});
