import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TodoItem } from "./todo-item";

describe("TodoItem Component", () => {
  const mockTodo = {
    tempId: "test-id",
    title: "Test Todo Item",
    completed: false,
  };

  it("should render the todo title correctly", () => {
    render(
      <TodoItem
        todo={mockTodo}
        isLocked={false}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText("Test Todo Item")).toBeInTheDocument();
  });

  it("should call onToggle when clicked and not locked", () => {
    const onToggle = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        isLocked={false}
        onToggle={onToggle}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Test Todo Item"));
    expect(onToggle).toHaveBeenCalledWith("test-id");
  });

  it("should not call onToggle when locked", () => {
    const onToggle = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        isLocked={true}
        onToggle={onToggle}
        onDelete={vi.fn()}
      />,
    );

    // Attempt click on the title container or the whole div
    fireEvent.click(screen.getByText("Test Todo Item"));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("should call onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        isLocked={false}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />,
    );

    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("test-id");
  });

  it("should display the completed state correctly", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        isLocked={false}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const title = screen.getByText("Test Todo Item");
    expect(title).toHaveClass("line-through");
  });
});
