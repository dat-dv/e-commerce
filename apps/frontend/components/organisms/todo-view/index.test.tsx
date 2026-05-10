import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TodoProvider } from "@/components/molecules/providers/todo-provider";

import { TodoView } from "./index";

describe("TodoView Organism", () => {
  it("should render loading skeleton when loading is true", () => {
    render(
      <TodoProvider initState={{ loading: true }}>
        <TodoView />
      </TodoProvider>,
    );

    expect(screen.getByTestId("todo-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });

  it("should render todo list and components when loading is false", () => {
    render(
      <TodoProvider
        initState={{
          todos: [{ tempId: "1", title: "Task 1" }],
          loading: false,
          total: 1,
          pageSize: 10,
          page: 1,
        }}
      >
        <TodoView />
      </TodoProvider>,
    );

    expect(screen.getByTestId("todo-list")).toBeInTheDocument();
    expect(screen.getByTestId("todo-input")).toBeInTheDocument();
    expect(screen.getByTestId("todo-filter")).toBeInTheDocument();
    expect(screen.getByTestId("todo-stats")).toBeInTheDocument();
    expect(screen.getByTestId("todo-pagination")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-skeleton")).not.toBeInTheDocument();
  });
});
