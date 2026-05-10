import { describe, expect, it } from "vitest";

import { ETodoFilter, ITodo } from "@/domain/todo/model/todo.model";

import { createTodoStore } from "./index";

describe("TodoStore", () => {
  const mockTodo: ITodo = {
    id: "1",
    tempId: "temp-1",
    title: "Test Todo",
    completed: false,
    createdAt: new Date().toISOString(),
    position: 0,
  };

  it("should initialize with default state", () => {
    const store = createTodoStore();
    const state = store.getState();

    expect(state.todos).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalCompleted).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.page).toBe(1);
    expect(state.filter).toBe(ETodoFilter.ALL);
  });

  it("should append a todo", () => {
    const store = createTodoStore();
    store.getState().appendTodo(mockTodo);

    const state = store.getState();
    expect(state.todos).toHaveLength(1);
    expect(state.todos[0]).toEqual(mockTodo);
    expect(state.total).toBe(1);
  });

  it("should update a todo and totalCompleted correctly", () => {
    const store = createTodoStore({
      todos: [mockTodo],
      total: 1,
      totalCompleted: 0,
    });

    // Mark as completed
    store.getState().updateTodo("temp-1", { completed: true });

    expect(store.getState().todos[0].completed).toBe(true);
    expect(store.getState().totalCompleted).toBe(1);

    // Mark as active again
    store.getState().updateTodo("temp-1", { completed: false });

    expect(store.getState().todos[0].completed).toBe(false);
    expect(store.getState().totalCompleted).toBe(0);
  });

  it("should delete a todo and update counts", () => {
    const completedTodo: ITodo = {
      ...mockTodo,
      tempId: "temp-comp",
      completed: true,
    };
    const store = createTodoStore({
      todos: [mockTodo, completedTodo],
      total: 2,
      totalCompleted: 1,
    });

    // Delete active todo
    store.getState().deleteTodo("temp-1");
    expect(store.getState().todos).toHaveLength(1);
    expect(store.getState().total).toBe(1);
    expect(store.getState().totalCompleted).toBe(1);

    // Delete completed todo
    store.getState().deleteTodo("temp-comp");
    expect(store.getState().todos).toHaveLength(0);
    expect(store.getState().total).toBe(0);
    expect(store.getState().totalCompleted).toBe(0);
  });

  it("should handle pending count correctly", () => {
    const store = createTodoStore();

    store.getState().incrementPendingCount();
    expect(store.getState().pendingCount).toBe(1);

    store.getState().incrementPendingCount();
    expect(store.getState().pendingCount).toBe(2);

    store.getState().decrementPendingCount();
    expect(store.getState().pendingCount).toBe(1);

    store.getState().decrementPendingCount();
    expect(store.getState().pendingCount).toBe(0);

    // Should not go below 0
    store.getState().decrementPendingCount();
    expect(store.getState().pendingCount).toBe(0);
  });

  it("should slice todos to pageSize on append", () => {
    const store = createTodoStore({ pageSize: 2 });

    store.getState().appendTodo({ ...mockTodo, tempId: "1" });
    store.getState().appendTodo({ ...mockTodo, tempId: "2" });
    store.getState().appendTodo({ ...mockTodo, tempId: "3" });

    const state = store.getState();
    expect(state.todos).toHaveLength(2);
    expect(state.todos[0].tempId).toBe("3");
    expect(state.total).toBe(3); // Total count still increases
  });

  it("should update query params", () => {
    const store = createTodoStore();

    store.getState().setPage(5);
    expect(store.getState().page).toBe(5);

    store.getState().setFilter(ETodoFilter.COMPLETED);
    expect(store.getState().filter).toBe(ETodoFilter.COMPLETED);

    store.getState().setPageSize(50);
    expect(store.getState().pageSize).toBe(50);
  });
});
