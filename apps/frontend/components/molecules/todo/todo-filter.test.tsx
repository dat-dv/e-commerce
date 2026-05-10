import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ETodoFilter } from "@/domain/todo/model/todo.model";
import { useTodoQuery } from "@/hooks/todo/use-todo-query";

import { TodoFilterMemo } from "./todo-filter";

// Mock the hook
vi.mock("@/hooks/todo/use-todo-query", () => ({
  useTodoQuery: vi.fn(),
}));

describe("TodoFilter Component", () => {
  it("should render all filter options", () => {
    vi.mocked(useTodoQuery).mockReturnValue({
      filter: ETodoFilter.ALL,
      setFilter: vi.fn(),
      page: 1,
      pageSize: 10,
      setPageSize: vi.fn(),
      setPage: vi.fn(),
    });

    render(<TodoFilterMemo />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("should highlight the active filter", () => {
    vi.mocked(useTodoQuery).mockReturnValue({
      filter: ETodoFilter.ACTIVE,
      setFilter: vi.fn(),
      page: 1,
      pageSize: 10,
      setPageSize: vi.fn(),
      setPage: vi.fn(),
    });

    render(<TodoFilterMemo />);

    const activeButton = screen.getByText("Active");
    expect(activeButton).toHaveClass("bg-primary");

    const allButton = screen.getByText("All");
    expect(allButton).not.toHaveClass("bg-primary");
  });

  it("should call setFilter when a filter is clicked", () => {
    const setFilter = vi.fn();
    vi.mocked(useTodoQuery).mockReturnValue({
      filter: ETodoFilter.ALL,
      setFilter,
      page: 1,
      pageSize: 10,
      setPageSize: vi.fn(),
      setPage: vi.fn(),
    });

    render(<TodoFilterMemo />);

    fireEvent.click(screen.getByText("Completed"));
    expect(setFilter).toHaveBeenCalledWith(ETodoFilter.COMPLETED);
  });
});
