import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { AppDropdown } from "./index";

describe("Dropdown Molecule", () => {
  it("should toggle content visibility when clicked", () => {
    render(
      <AppDropdown
        trigger={({ ref, toggle }) => (
          <button ref={ref} onClick={toggle}>
            Open Menu
          </button>
        )}
      >
        <div>Menu Content</div>
      </AppDropdown>,
    );

    expect(screen.queryByText("Menu Content")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Menu"));
    expect(screen.getByText("Menu Content")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Menu"));
    expect(screen.queryByText("Menu Content")).not.toBeInTheDocument();
  });

  it("should close dropdown when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <AppDropdown
          trigger={({ ref, toggle }) => (
            <button ref={ref} onClick={toggle}>
              Open Menu
            </button>
          )}
        >
          <div>Menu Content</div>
        </AppDropdown>
      </div>,
    );

    fireEvent.click(screen.getByText("Open Menu"));
    expect(screen.getByText("Menu Content")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByText("Menu Content")).not.toBeInTheDocument();
  });
});
