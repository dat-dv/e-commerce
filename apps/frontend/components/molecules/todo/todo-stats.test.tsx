import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useTodoStats } from "@/hooks/todo/use-todo-stats";

import TodoStats from "./todo-stats";

// Mock the hook
vi.mock("@/hooks/todo/use-todo-stats", () => ({
  useTodoStats: vi.fn(),
}));

describe("TodoStats Component", () => {
  it("should render the todo counts correctly", () => {
    vi.mocked(useTodoStats).mockReturnValue({
      totalTasks: 10,
      completedTasks: 5,
    });

    render(<TodoStats />);

    expect(screen.getByText("Active Tasks")).toBeInTheDocument();
    expect(screen.getByText("5/10")).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });
});
